import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const STORAGE_KEYS = {
  CLIENTS: 'zero_carta_clients',
  CURRENT_CLIENT: 'zero_carta_current_client',
  CALL_REQUESTS: 'zero_carta_call_requests',
  SETTINGS: 'zero_carta_settings',
};

const DEFAULT_SETTINGS = {
  adminPin: '230888',
  whatsappNumber: '3382174844',
  meetEmail: 'rachelebossazerocarta@gmail.it',
  meetRoomUrl: 'https://meet.google.com/new',
  isOnline: true, // Verde online / Rosso offline
  officeHours: 'Lun - Ven: 09:00 - 12:00 e 16:30 - 18:30 • Sab: 09:00 - 12:00',
};

// Dati di esempio iniziali per mostrare subito un'app ricca e funzionale
const INITIAL_CLIENTS = [
  {
    id: 'cli-1',
    nome: 'Giuseppe',
    cognome: 'Esposito',
    cellulare: '3391234567',
    email: 'g.esposito@email.it',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastService: 'Modello 730 Dipendenti',
  },
  {
    id: 'cli-2',
    nome: 'Maria',
    cognome: 'Romano',
    cellulare: '3409876543',
    email: 'maria.romano@gmail.com',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastService: 'ISEE Ordinario 2026',
  },
  {
    id: 'cli-3',
    nome: 'Salvatore',
    cognome: 'Ferraro',
    cellulare: '3285551234',
    email: 's.ferraro@virgilio.it',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    lastService: 'Assegno Unico Universale',
  }
];

export function AppProvider({ children }) {
  // Sincronizzazione multi-tab tramite BroadcastChannel
  const [broadcastChannel, setBroadcastChannel] = useState(null);

  // Stato Impostazioni
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!saved) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(saved);
      if (parsed.officeHours === 'Lun - Ven: 09:00 - 18:30' || !parsed.officeHours.includes('16:30')) {
        parsed.officeHours = DEFAULT_SETTINGS.officeHours;
      }
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Stato Rubrica Clienti
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  // Durata sessione cliente: 120 minuti esatti
  const CLIENT_SESSION_DURATION_MS = 120 * 60 * 1000;

  // Stato Cliente Attualmente Connesso con controllo scadenza 120 minuti
  const [currentClient, setCurrentClient] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_CLIENT);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && parsed.sessionExpiresAt) {
        if (Date.now() > parsed.sessionExpiresAt) {
          localStorage.removeItem(STORAGE_KEYS.CURRENT_CLIENT);
          return null;
        }
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // Notifica di avvenuta disconnessione dopo 120 minuti
  const [sessionExpiredAlert, setSessionExpiredAlert] = useState(false);

  // Stato Richieste di Videochiamata e Prenotazioni
  const [callRequests, setCallRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CALL_REQUESTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modalità vista: 'client' o 'admin'
  const [viewMode, setViewMode] = useState('client');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Inizializzazione Broadcast Channel per sincronizzazione in tempo reale
  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel('zero_carta_channel');
      setBroadcastChannel(bc);

      bc.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'SYNC_ALL') {
          if (payload.settings) setSettings(payload.settings);
          if (payload.clients) setClients(payload.clients);
          if (payload.callRequests) setCallRequests(payload.callRequests);
        } else if (type === 'STATUS_TOGGLE') {
          setSettings(prev => ({ ...prev, isOnline: payload.isOnline }));
        } else if (type === 'NEW_CLIENT') {
          setClients(payload.clients);
        } else if (type === 'CALL_REQUEST_UPDATE') {
          setCallRequests(payload.callRequests);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported or error:', e);
    }

    return () => {
      if (bc) bc.close();
    };
  }, []);

  // Salvataggio su localStorage e notifica broadcast
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALL_REQUESTS, JSON.stringify(callRequests));
  }, [callRequests]);

  useEffect(() => {
    if (currentClient) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CLIENT, JSON.stringify(currentClient));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CLIENT);
    }
  }, [currentClient]);

  // Funzione broadcast ausiliaria
  const broadcast = (type, payload) => {
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type, payload });
      } catch (err) {
        console.error('Broadcast error:', err);
      }
    }
  };

  // Controllo attivo scadenza sessione 120 minuti
  useEffect(() => {
    if (!currentClient || !currentClient.sessionExpiresAt) return;

    const checkSession = () => {
      const remaining = currentClient.sessionExpiresAt - Date.now();
      if (remaining <= 0) {
        // Trascorsi 120 minuti: scollega tutto automaticamente
        setCurrentClient(null);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_CLIENT);
        setSessionExpiredAlert(true);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 5000); // verifica ogni 5 secondi

    return () => clearInterval(interval);
  }, [currentClient]);

  // Calcolo minuti di sessione rimanenti
  const getSessionRemainingMinutes = () => {
    if (!currentClient || !currentClient.sessionExpiresAt) return 0;
    const remainingMs = currentClient.sessionExpiresAt - Date.now();
    return Math.max(0, Math.ceil(remainingMs / 60000));
  };

  // 1. Registrazione o Aggiornamento Cliente (durata sessione: 120 minuti esatti)
  const registerClient = (clientData) => {
    const now = Date.now();
    const expiresAt = now + CLIENT_SESSION_DURATION_MS;

    const existingIndex = clients.findIndex(
      c => (clientData.email && c.email.toLowerCase() === clientData.email.toLowerCase()) ||
           (clientData.cellulare && c.cellulare.replace(/\s+/g, '') === clientData.cellulare.replace(/\s+/g, ''))
    );

    let updatedClients = [...clients];
    let clientToSave;

    if (existingIndex >= 0) {
      clientToSave = {
        ...updatedClients[existingIndex],
        ...clientData,
        updatedAt: new Date().toISOString(),
        sessionExpiresAt: expiresAt,
      };
      updatedClients[existingIndex] = clientToSave;
    } else {
      clientToSave = {
        id: `cli-${now}`,
        ...clientData,
        createdAt: new Date().toISOString(),
        lastService: clientData.lastService || 'Accesso all\'App',
        sessionExpiresAt: expiresAt,
      };
      updatedClients.unshift(clientToSave);
    }

    setClients(updatedClients);
    setCurrentClient(clientToSave);
    setSessionExpiredAlert(false);
    broadcast('NEW_CLIENT', { clients: updatedClients });
    return clientToSave;
  };

  // Logout cliente (scollega tutto)
  const logoutClient = () => {
    setCurrentClient(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_CLIENT);
  };

  // Cancellazione completa e manuale della rubrica clienti da pannello gestione
  const clearClients = () => {
    setClients([]);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify([]));
    broadcast('NEW_CLIENT', { clients: [] });
  };

  // Cancellazione singolo contatto dalla rubrica
  const deleteClient = (clientId) => {
    const updated = clients.filter(c => c.id !== clientId);
    setClients(updated);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated));
    broadcast('NEW_CLIENT', { clients: updated });
  };

  // 2. Toggle Stato Online / Offline da Admin
  const toggleOnlineStatus = (newStatus) => {
    const updatedStatus = typeof newStatus === 'boolean' ? newStatus : !settings.isOnline;
    const updatedSettings = { ...settings, isOnline: updatedStatus };
    setSettings(updatedSettings);
    broadcast('STATUS_TOGGLE', { isOnline: updatedStatus });
  };

  // Aggiornamento impostazioni (WhatsApp, email Meet, PIN)
  const updateSettings = (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    broadcast('SYNC_ALL', { settings: merged, clients, callRequests });
  };

  // 3. Creazione Richiesta Videochiamata (Immediata o Prenotazione Orario)
  const createCallRequest = ({ serviceId, serviceTitle, type = 'instant', scheduledDate = null, scheduledTime = null, note = '' }) => {
    if (!currentClient) {
      throw new Error('Devi prima registrarti per avviare o prenotare una videochiamata.');
    }

    const newRequest = {
      id: `call-${Date.now()}`,
      clientId: currentClient.id,
      clientName: `${currentClient.nome} ${currentClient.cognome}`,
      clientPhone: currentClient.cellulare,
      clientEmail: currentClient.email,
      serviceId,
      serviceTitle: serviceTitle || 'Consulenza Generale Patronato/CAF',
      type, // 'instant' o 'scheduled'
      scheduledDate,
      scheduledTime,
      note,
      status: 'pending', // 'pending', 'accepted', 'rejected'
      meetLink: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newRequest, ...callRequests];
    setCallRequests(updated);

    // Aggiorna anche l'ultimo servizio del cliente nella rubrica
    registerClient({
      ...currentClient,
      lastService: serviceTitle || 'Richiesta Videochiamata'
    });

    broadcast('CALL_REQUEST_UPDATE', { callRequests: updated });
    return newRequest;
  };

  // 4. Gestione Richiesta da Admin (Accetta, Metti in attesa, Rifiuta)
  const updateCallRequestStatus = (requestId, newStatus, meetLink = '') => {
    const updated = callRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: newStatus,
          meetLink: meetLink || req.meetLink || (newStatus === 'accepted' ? (settings.meetRoomUrl || 'https://meet.google.com/new') : ''),
          updatedAt: new Date().toISOString(),
        };
      }
      return req;
    });

    setCallRequests(updated);
    broadcast('CALL_REQUEST_UPDATE', { callRequests: updated });
  };

  // Elimina richiesta o prenotazione
  const deleteCallRequest = (requestId) => {
    const updated = callRequests.filter(req => req.id !== requestId);
    setCallRequests(updated);
    broadcast('CALL_REQUEST_UPDATE', { callRequests: updated });
  };

  // 5. Generatore Link WhatsApp automatico
  const getWhatsAppLink = (phoneNumber, text) => {
    if (!phoneNumber) return '#';
    let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanNumber.startsWith('39') && cleanNumber.length <= 10) {
      cleanNumber = '39' + cleanNumber;
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  // Generatore messaggio WhatsApp in base allo stato
  const generateWhatsAppMessage = (request, status, customMeetLink = '') => {
    const nome = request.clientName || 'Cliente';
    const servizio = request.serviceTitle || 'pratica patronato';
    const linkMeet = customMeetLink || request.meetLink || settings.meetRoomUrl || 'https://meet.google.com/new';

    switch (status) {
      case 'pending':
        return `Gentile ${nome}, la sua richiesta di videochiamata con il CAF Zero Carta di Bossa Rachele per "${servizio}" è stata presa in carico ed è attualmente IN STATO DI ATTESA. Le risponderemo a breve per confermarle il collegamento sia qui su WhatsApp sia via Email. A presto!`;
      case 'accepted':
        return `Gentile ${nome}, la sua videochiamata con Bossa Rachele (CAF Patronato Zero Carta) per "${servizio}" è STATA ACCETTATA ed è in FASE DI ESECUZIONE!\n\nEcco il link di Google Meet per collegarsi subito:\n${linkMeet}\n\n(Il promemoria con il link le è stato inviato anche al suo indirizzo email: ${request.clientEmail || 'registrato'}). Clicchi sul link per avviare la videochiamata. A tra poco online!`;
      case 'rejected':
        return `Gentile ${nome}, la informiamo che al momento non è possibile avviare la videochiamata per "${servizio}". La preghiamo di verificare i nostri orari e prenotare una nuova data, oppure scriverci qui in chat WhatsApp per maggiori informazioni. Cordiali saluti, Bossa Rachele (Zero Carta).`;
      default:
        return `Salve da Zero Carta di Bossa Rachele. In merito alla sua pratica "${servizio}": link Meet: ${linkMeet}`;
    }
  };

  // Generatore Link Email per invio link Meet al cliente
  const generateEmailLink = (request, customMeetLink = '') => {
    const nome = request.clientName || 'Gentile Cliente';
    const email = request.clientEmail || '';
    const servizio = request.serviceTitle || 'Pratica Patronato & CAF';
    const linkMeet = customMeetLink || request.meetLink || settings.meetRoomUrl || 'https://meet.google.com/new';
    
    const subject = `Link Google Meet Videochiamata - Zero Carta di Bossa Rachele (${servizio})`;
    const body = `Gentile ${nome},\n\nLa sua richiesta di videochiamata con Bossa Rachele per la pratica "${servizio}" è stata accettata con successo!\n\nEcco il link per accedere alla stanza virtuale Google Meet:\n${linkMeet}\n\nLe abbiamo inviato il promemoria anche sul suo numero WhatsApp (${request.clientPhone}).\n\nPer qualsiasi informazione o supporto diretto può contattarci al 338 2174844.\n\nCordiali saluti,\nBossa Rachele\nZero Carta - Patronato & CAF Online\nTel/WhatsApp: 338 2174844\nEmail: ${settings.meetEmail}`;
    
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Verifica disponibilità slot (data e ora)
  const isSlotBooked = (dateStr, timeStr) => {
    return callRequests.some(
      req => req.status !== 'rejected' &&
             req.scheduledDate === dateStr &&
             req.scheduledTime === timeStr
    );
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        toggleOnlineStatus,
        clients,
        currentClient,
        registerClient,
        logoutClient,
        callRequests,
        createCallRequest,
        updateCallRequestStatus,
        deleteCallRequest,
        isSlotBooked,
        viewMode,
        setViewMode,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        getWhatsAppLink,
        generateWhatsAppMessage,
        generateEmailLink,
        sessionExpiredAlert,
        setSessionExpiredAlert,
        getSessionRemainingMinutes,
        clearClients,
        deleteClient,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve essere utilizzato all\'interno di un AppProvider');
  }
  return context;
}
