import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, onSnapshot, getDocs, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const AppContext = createContext();

const STORAGE_KEYS = {
  CURRENT_CLIENT: 'zero_carta_current_client',
};

const DEFAULT_SETTINGS = {
  adminPin: '230888',
  whatsappNumber: '3382174844',
  meetEmail: 'rachelebossazerocarta@gmail.it',
  meetRoomUrl: 'https://meet.google.com/new',
  isOnline: true,
  officeHours: 'Lun - Ven: 09:00 - 12:00 e 16:30 - 18:30 • Sab: 09:00 - 12:00',
};

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [clients, setClients] = useState([]);
  const [callRequests, setCallRequests] = useState([]);
  const [viewMode, setViewMode] = useState('client');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [sessionExpiredAlert, setSessionExpiredAlert] = useState(false);
  const CLIENT_SESSION_DURATION_MS = 120 * 60 * 1000;

  const [currentClient, setCurrentClient] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_CLIENT);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && parsed.sessionExpiresAt && Date.now() > parsed.sessionExpiresAt) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_CLIENT);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // Listener Firestore: Impostazioni
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'global', 'settings'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() });
      } else {
        setDoc(doc(db, 'global', 'settings'), DEFAULT_SETTINGS);
      }
    });
    return () => unsub();
  }, []);

  // Listener Firestore: Clienti
  useEffect(() => {
    const q = query(collection(db, 'clients'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClients(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    });
    return () => unsub();
  }, []);

  // Listener Firestore: Richieste
  useEffect(() => {
    const q = query(collection(db, 'callRequests'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCallRequests(data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (currentClient) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CLIENT, JSON.stringify(currentClient));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CLIENT);
    }
  }, [currentClient]);

  // Session timer
  useEffect(() => {
    if (!currentClient || !currentClient.sessionExpiresAt) return;
    const checkSession = () => {
      if (currentClient.sessionExpiresAt - Date.now() <= 0) {
        setCurrentClient(null);
        setSessionExpiredAlert(true);
      }
    };
    checkSession();
    const interval = setInterval(checkSession, 5000);
    return () => clearInterval(interval);
  }, [currentClient]);

  const getSessionRemainingMinutes = () => {
    if (!currentClient || !currentClient.sessionExpiresAt) return 0;
    return Math.max(0, Math.ceil((currentClient.sessionExpiresAt - Date.now()) / 60000));
  };

  const toggleOnlineStatus = async (newStatus) => {
    const updatedStatus = typeof newStatus === 'boolean' ? newStatus : !settings.isOnline;
    await updateDoc(doc(db, 'global', 'settings'), { isOnline: updatedStatus });
  };

  const updateSettings = async (newSettings) => {
    await updateDoc(doc(db, 'global', 'settings'), newSettings);
  };

  const registerClient = async (clientData) => {
    const now = Date.now();
    const expiresAt = now + CLIENT_SESSION_DURATION_MS;
    
    const existingClient = clients.find(
      c => (clientData.email && c.email.toLowerCase() === clientData.email.toLowerCase()) ||
           (clientData.cellulare && c.cellulare.replace(/\s+/g, '') === clientData.cellulare.replace(/\s+/g, ''))
    );

    let clientToSave;
    if (existingClient) {
      clientToSave = { ...existingClient, ...clientData, updatedAt: new Date().toISOString(), sessionExpiresAt: expiresAt };
      await updateDoc(doc(db, 'clients', existingClient.id), clientToSave);
    } else {
      const newId = `cli-${now}`;
      clientToSave = { id: newId, ...clientData, createdAt: new Date().toISOString(), lastService: clientData.lastService || 'Accesso all\'App', sessionExpiresAt: expiresAt };
      await setDoc(doc(db, 'clients', newId), clientToSave);
    }
    
    setCurrentClient(clientToSave);
    setSessionExpiredAlert(false);
    return clientToSave;
  };

  const logoutClient = () => {
    setCurrentClient(null);
  };

  const clearClients = async () => {
    const snapshot = await getDocs(collection(db, 'clients'));
    snapshot.forEach(async (d) => await deleteDoc(d.ref));
  };

  const deleteClient = async (clientId) => {
    await deleteDoc(doc(db, 'clients', clientId));
  };

  const createCallRequest = async ({ serviceId, serviceTitle, type = 'instant', scheduledDate = null, scheduledTime = null, note = '' }) => {
    if (!currentClient) throw new Error('Devi prima registrarti.');
    const newId = `call-${Date.now()}`;
    const newRequest = {
      id: newId, clientId: currentClient.id, clientName: `${currentClient.nome} ${currentClient.cognome}`,
      clientPhone: currentClient.cellulare, clientEmail: currentClient.email, serviceId,
      serviceTitle: serviceTitle || 'Consulenza Generale', type, scheduledDate, scheduledTime, note,
      status: 'pending', meetLink: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'callRequests', newId), newRequest);
    await updateDoc(doc(db, 'clients', currentClient.id), { lastService: serviceTitle || 'Richiesta Videochiamata' });
    return newRequest;
  };

  const updateCallRequestStatus = async (requestId, newStatus, meetLink = '') => {
    const req = callRequests.find(r => r.id === requestId);
    if (!req) return;
    const finalLink = meetLink || req.meetLink || (newStatus === 'accepted' ? (settings.meetRoomUrl || 'https://meet.google.com/new') : '');
    await updateDoc(doc(db, 'callRequests', requestId), { status: newStatus, meetLink: finalLink, updatedAt: new Date().toISOString() });
  };

  const deleteCallRequest = async (requestId) => {
    await deleteDoc(doc(db, 'callRequests', requestId));
  };

  const getWhatsAppLink = (phoneNumber, text) => {
    if (!phoneNumber) return '#';
    let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanNumber.startsWith('39') && cleanNumber.length <= 10) cleanNumber = '39' + cleanNumber;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const generateWhatsAppMessage = (request, status, customMeetLink = '') => {
    const nome = request.clientName || 'Cliente';
    const servizio = request.serviceTitle || 'pratica patronato';
    const linkMeet = customMeetLink || request.meetLink || settings.meetRoomUrl || 'https://meet.google.com/new';
    switch (status) {
      case 'pending': return `Gentile ${nome}, la sua richiesta di videochiamata con il CAF Zero Carta di Bossa Rachele per "${servizio}" è stata presa in carico ed è attualmente IN STATO DI ATTESA. Le risponderemo a breve per confermarle il collegamento sia qui su WhatsApp sia via Email. A presto!`;
      case 'accepted': return `Gentile ${nome}, la sua videochiamata con Bossa Rachele (CAF Patronato Zero Carta) per "${servizio}" è STATA ACCETTATA ed è in FASE DI ESECUZIONE!\n\nEcco il link di Google Meet per collegarsi subito:\n${linkMeet}\n\n(Il promemoria con il link le è stato inviato anche al suo indirizzo email: ${request.clientEmail || 'registrato'}). Clicchi sul link per avviare la videochiamata. A tra poco online!`;
      case 'rejected': return `Gentile ${nome}, la informiamo che al momento non è possibile avviare la videochiamata per "${servizio}". La preghiamo di verificare i nostri orari e prenotare una nuova data, oppure scriverci qui in chat WhatsApp per maggiori informazioni. Cordiali saluti, Bossa Rachele (Zero Carta).`;
      default: return `Salve da Zero Carta di Bossa Rachele. In merito alla sua pratica "${servizio}": link Meet: ${linkMeet}`;
    }
  };

  const generateEmailLink = (request, customMeetLink = '') => {
    const nome = request.clientName || 'Gentile Cliente';
    const email = request.clientEmail || '';
    const servizio = request.serviceTitle || 'Pratica Patronato & CAF';
    const linkMeet = customMeetLink || request.meetLink || settings.meetRoomUrl || 'https://meet.google.com/new';
    const subject = `Link Google Meet Videochiamata - Zero Carta di Bossa Rachele (${servizio})`;
    const body = `Gentile ${nome},\n\nLa sua richiesta di videochiamata con Bossa Rachele per la pratica "${servizio}" è stata accettata con successo!\n\nEcco il link per accedere alla stanza virtuale Google Meet:\n${linkMeet}\n\nLe abbiamo inviato il promemoria anche sul suo numero WhatsApp (${request.clientPhone}).\n\nPer qualsiasi informazione o supporto diretto può contattarci al 338 2174844.\n\nCordiali saluti,\nBossa Rachele\nZero Carta - Patronato & CAF Online\nTel/WhatsApp: 338 2174844\nEmail: ${settings.meetEmail}`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const isSlotBooked = (dateStr, timeStr) => {
    return callRequests.some(req => req.status !== 'rejected' && req.scheduledDate === dateStr && req.scheduledTime === timeStr);
  };

  return (
    <AppContext.Provider value={{
      settings, updateSettings, toggleOnlineStatus, clients, currentClient, registerClient, logoutClient,
      callRequests, createCallRequest, updateCallRequestStatus, deleteCallRequest, isSlotBooked, viewMode,
      setViewMode, isAdminAuthenticated, setIsAdminAuthenticated, getWhatsAppLink, generateWhatsAppMessage,
      generateEmailLink, sessionExpiredAlert, setSessionExpiredAlert, getSessionRemainingMinutes, clearClients, deleteClient
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve essere utilizzato all\'interno di un AppProvider');
  return context;
}
