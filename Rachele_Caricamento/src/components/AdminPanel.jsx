import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportClientsToExcel, exportClientsToPDF } from '../utils/exportUtils';
import { 
  Lock, 
  Unlock, 
  Power, 
  Users, 
  Video, 
  FileSpreadsheet, 
  FileText, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  Search, 
  Plus, 
  Trash2, 
  AlertCircle,
  Mail,
  ShieldCheck,
  Send,
  Calendar,
  LogOut,
  RefreshCw
} from 'lucide-react';

export default function AdminPanel({ onClose }) {
  const {
    settings,
    updateSettings,
    toggleOnlineStatus,
    clients,
    registerClient,
    clearClients,
    deleteClient,
    callRequests,
    updateCallRequestStatus,
    deleteCallRequest,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    getWhatsAppLink,
    generateWhatsAppMessage,
    generateEmailLink
  } = useApp();

  // Stato PIN di accesso
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Tab di navigazione admin: 'calls' (Videochiamate), 'clients' (Rubrica), 'settings' (Impostazioni)
  const [activeTab, setActiveTab] = useState('calls');

  // Ricerca rubrica
  const [clientSearch, setClientSearch] = useState('');
  
  // Modale inserimento Link Meet manuale per accettazione
  const [activeMeetModal, setActiveMeetModal] = useState(null);
  const [customMeetLink, setCustomMeetLink] = useState('');
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(true);
  const [sendViaEmail, setSendViaEmail] = useState(true);

  // Modale aggiunta cliente manuale
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientData, setNewClientData] = useState({ nome: '', cognome: '', cellulare: '', email: '', lastService: '' });

  // Impostazioni form
  const [settingsForm, setSettingsForm] = useState({
    whatsappNumber: settings.whatsappNumber,
    meetEmail: settings.meetEmail,
    meetRoomUrl: settings.meetRoomUrl,
    adminPin: settings.adminPin
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Gestione PIN
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === settings.adminPin) {
      setIsAdminAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handlePinDigit = (digit) => {
    if (pinInput.length < 8) {
      setPinInput(prev => prev + digit);
    }
  };

  const handleClearPin = () => {
    setPinInput('');
    setPinError(false);
  };

  // Se l'admin non è autenticato, mostra la schermata di sblocco PIN segreta su tema rosso
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/85 backdrop-blur-md">
        <div className="w-full max-w-md bg-gradient-to-b from-red-900 to-red-950 border-2 border-red-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center text-white relative">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-red-900/80 hover:bg-red-800 text-rose-200 hover:text-white transition"
          >
            ✕
          </button>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-950/30">
            <Lock className="w-8 h-8 text-red-950" />
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            Pannello Gestore App
          </h3>
          <p className="text-xs text-rose-200 mt-1">
            Zero Carta di Bossa Rachele • Inserisci il codice PIN di sicurezza
          </p>

          <form onSubmit={handlePinSubmit} className="mt-6">
            {/* Indicatori a pallini segreti oscurati */}
            <div className="flex items-center justify-center gap-3.5 my-5">
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const isFilled = pinInput.length > index;
                return (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      isFilled 
                        ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-400/60 border-2 border-yellow-200' 
                        : 'bg-red-950 border-2 border-red-800'
                    }`}
                  />
                );
              })}
            </div>

            <div className="relative max-w-xs mx-auto mb-4">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••••"
                autoComplete="off"
                className="w-full text-center tracking-[0.6em] text-2xl font-bold py-3 bg-red-950/80 border-2 border-red-700 rounded-2xl text-amber-300 placeholder:text-red-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
              />
            </div>

            {pinError && (
              <p className="text-xs text-amber-200 bg-red-900/90 py-1.5 px-3 rounded-lg font-bold mb-3 border border-red-600">
                Codice PIN non corretto. Riprova.
              </p>
            )}

            {/* Tastierino rapido per tablet/mobile */}
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePinDigit(num.toString())}
                  className="py-3 bg-red-900 hover:bg-red-800 text-white text-lg font-bold rounded-xl active:scale-95 transition border border-red-700"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearPin}
                className="py-3 bg-red-950 hover:bg-red-900 text-rose-300 text-xs font-bold rounded-xl active:scale-95 transition border border-red-800"
              >
                Cancella
              </button>
              <button
                type="button"
                onClick={() => handlePinDigit('0')}
                className="py-3 bg-red-900 hover:bg-red-800 text-white text-lg font-bold rounded-xl active:scale-95 transition border border-red-700"
              >
                0
              </button>
              <button
                type="submit"
                className="py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-red-950 text-xs font-extrabold rounded-xl active:scale-95 transition shadow-lg"
              >
                Entra
              </button>
            </div>

            <p className="text-[11px] text-rose-300">
              Accesso protetto riservato al gestore autorizzato.
            </p>
          </form>

        </div>
      </div>
    );
  }

  // GESTORE AUTENTICATO - PANNELLO AMMINISTRATORE SU SFONDO ROSSO
  const filteredClients = clients.filter(c => {
    const q = clientSearch.toLowerCase();
    return (
      (c.nome && c.nome.toLowerCase().includes(q)) ||
      (c.cognome && c.cognome.toLowerCase().includes(q)) ||
      (c.cellulare && c.cellulare.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.lastService && c.lastService.toLowerCase().includes(q))
    );
  });

  const pendingCalls = callRequests.filter(r => r.status === 'pending');
  const acceptedCalls = callRequests.filter(r => r.status === 'accepted');

  const openAcceptModal = (request) => {
    setActiveMeetModal(request);
    setCustomMeetLink(request.meetLink || settings.meetRoomUrl || 'https://meet.google.com/new');
    setSendViaWhatsApp(true);
    setSendViaEmail(true);
  };

  const confirmAcceptWithMeet = () => {
    if (activeMeetModal) {
      updateCallRequestStatus(activeMeetModal.id, 'accepted', customMeetLink);

      // 1. Invio del link Meet su WhatsApp del cliente
      if (sendViaWhatsApp && activeMeetModal.clientPhone) {
        const waText = generateWhatsAppMessage(activeMeetModal, 'accepted', customMeetLink);
        const waUrl = getWhatsAppLink(activeMeetModal.clientPhone, waText);
        window.open(waUrl, '_blank');
      }

      // 2. Invio del link Meet via Email del cliente
      if (sendViaEmail && activeMeetModal.clientEmail) {
        const emailUrl = generateEmailLink(activeMeetModal, customMeetLink);
        window.open(emailUrl, '_blank');
      }

      setActiveMeetModal(null);
    }
  };

  const handleAddClientSubmit = (e) => {
    e.preventDefault();
    if (!newClientData.nome || !newClientData.cognome || !newClientData.cellulare) {
      alert('Nome, cognome e cellulare sono obbligatori.');
      return;
    }
    registerClient(newClientData);
    setNewClientData({ nome: '', cognome: '', cellulare: '', email: '', lastService: '' });
    setShowAddClientModal(false);
  };

  const handleClearRubrica = () => {
    if (clients.length === 0) {
      alert('La rubrica è già vuota.');
      return;
    }
    const confirmed = window.confirm(
      `ATTENZIONE: Sei sicuro di voler cancellare manualmente l'intera rubrica?\n\nVerranno eliminati permanentemente tutti i ${clients.length} clienti registrati.\n\nSuggerimento: Se desideri conservarli prima, usa i pulsanti "Salva in Excel" o "Salva in PDF".`
    );
    if (confirmed) {
      clearClients();
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 via-red-900 to-rose-950 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* BARRA SUPERIORE GESTORE */}
        <div className="bg-red-900/90 border border-red-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Info Brand & Gestore */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg border border-red-200">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Pannello di Gestione Zero Carta
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-amber-400/60 text-amber-300 text-[11px] font-bold">
                  Accesso Autorizzato
                </span>
              </div>
              <p className="text-xs text-rose-200">
                Titolare: <strong>Bossa Rachele</strong> • Videochiamate Google Meet collegate a: <code className="text-amber-200">{settings.meetEmail}</code>
              </p>
            </div>
          </div>

          {/* PULSANTE MASTER: ON-LINE (VERDE) / OFF-LINE (ROSSO) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleOnlineStatus(!settings.isOnline)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-extrabold text-sm sm:text-base shadow-xl transition-all transform active:scale-95 ${
                settings.isOnline
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-4 ring-emerald-400/30'
                  : 'bg-rose-700 hover:bg-rose-600 text-white ring-4 ring-rose-400/30'
              }`}
              title="Clicca per cambiare lo stato visibile a tutti i clienti"
            >
              <Power className="w-5 h-5" />
              <span>{settings.isOnline ? 'STATO: ON-LINE (Verde)' : 'STATO: OFF-LINE (Rosso)'}</span>
              <span className={`w-3 h-3 rounded-full ${settings.isOnline ? 'bg-white animate-ping' : 'bg-white/80'}`}></span>
            </button>

            <button
              onClick={() => setIsAdminAuthenticated(false)}
              className="p-3 rounded-2xl bg-red-950/80 hover:bg-red-800 text-rose-200 hover:text-white border border-red-700 transition"
              title="Blocca pannello gestore"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* METRICHE RAPIDE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-red-900/80 border border-red-700/70 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div>
              <p className="text-xs font-bold text-rose-200 uppercase">Rubrica Clienti Iscritti</p>
              <p className="text-2xl font-black text-white mt-1">{clients.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-950/70 text-amber-400 flex items-center justify-center border border-red-700">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-red-900/80 border border-red-700/70 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div>
              <p className="text-xs font-bold text-rose-200 uppercase">Richieste in Attesa</p>
              <p className="text-2xl font-black text-amber-300 mt-1">{pendingCalls.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-950/70 text-amber-400 flex items-center justify-center border border-amber-800">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-red-900/80 border border-red-700/70 rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div>
              <p className="text-xs font-bold text-rose-200 uppercase">Videochiamate Accettate</p>
              <p className="text-2xl font-black text-emerald-300 mt-1">{acceptedCalls.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/70 text-emerald-400 flex items-center justify-center border border-emerald-800">
              <Video className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* NAVIGAZIONE TAB */}
        <div className="flex items-center gap-2 border-b border-red-800 pb-1">
          <button
            onClick={() => setActiveTab('calls')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === 'calls'
                ? 'bg-amber-400 text-red-950 shadow-md font-black'
                : 'text-rose-200 hover:text-white hover:bg-red-900/70'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Gestione Videochiamate & Richieste Live ({callRequests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === 'clients'
                ? 'bg-amber-400 text-red-950 shadow-md font-black'
                : 'text-rose-200 hover:text-white hover:bg-red-900/70'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Rubrica Clienti & Esportazione ({clients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-red-950 shadow-md font-black'
                : 'text-rose-200 hover:text-white hover:bg-red-900/70'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Configurazione & WhatsApp</span>
          </button>
        </div>

        {/* CONTENUTO TAB 1: GESTIONE VIDEOCHIAMATE & RICHIESTE */}
        {activeTab === 'calls' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Coda Richieste e Prenotazioni Videochiamate Google Meet</span>
              </h2>
              <span className="text-xs text-rose-200">
                Email operatore: <strong className="text-amber-300">{settings.meetEmail}</strong>
              </span>
            </div>

            {callRequests.length === 0 ? (
              <div className="bg-red-900/60 border border-red-800 rounded-3xl p-10 text-center text-rose-300">
                <Video className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="font-bold text-base text-white">Nessuna richiesta di videochiamata presente</p>
                <p className="text-xs text-rose-200 mt-1">
                  Quando un cliente chiederà una videochiamata istantanea o prenoterà uno slot orario, comparirà qui con tutti i pulsanti per accettare, rifiutare o mettere in attesa.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {callRequests.map(req => {
                  const isAccepted = req.status === 'accepted';
                  const isPending = req.status === 'pending';
                  const isRejected = req.status === 'rejected';

                  // Link WhatsApp ed Email dedicati con messaggio precompilato contenente il link Meet
                  const waAttesaLink = getWhatsAppLink(req.clientPhone, generateWhatsAppMessage(req, 'pending'));
                  const waAccettaLink = getWhatsAppLink(req.clientPhone, generateWhatsAppMessage(req, 'accepted', req.meetLink));
                  const emailAccettaLink = generateEmailLink(req, req.meetLink);
                  const waRifiutaLink = getWhatsAppLink(req.clientPhone, generateWhatsAppMessage(req, 'rejected'));

                  return (
                    <div 
                      key={req.id}
                      className={`p-5 rounded-2xl border-2 transition-all ${
                        isAccepted 
                          ? 'bg-emerald-950/40 border-emerald-600' 
                          : isRejected 
                          ? 'bg-rose-950/40 border-rose-600' 
                          : 'bg-red-900/80 border-red-700'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Info Cliente e Pratica */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-extrabold text-white">
                              {req.clientName}
                            </span>

                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              isAccepted ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-600' :
                              isRejected ? 'bg-rose-900/80 text-rose-200 border border-rose-600' :
                              'bg-amber-900/80 text-amber-200 border border-amber-600'
                            }`}>
                              {isAccepted ? 'Fase di Esecuzione / Accettata' :
                               isRejected ? 'Rifiutata' :
                               'In Stato di Attesa'}
                            </span>

                            <span className="text-xs text-amber-300 font-semibold px-2 py-0.5 rounded-md bg-red-950 border border-red-700">
                              {req.type === 'instant' ? '⚡ Istantanea ORA' : `📅 Prenotata: ${req.scheduledDate} ore ${req.scheduledTime}`}
                            </span>
                          </div>

                          <div className="text-xs text-rose-100 flex flex-wrap items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-amber-400" />
                              <a href={`tel:${req.clientPhone}`} className="hover:text-amber-300 underline">
                                {req.clientPhone}
                              </a>
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-amber-400" />
                              <span>{req.clientEmail}</span>
                            </span>
                            <span className="text-rose-200">
                              Pratica: <strong className="text-white">{req.serviceTitle}</strong>
                            </span>
                          </div>

                          {req.note && (
                            <p className="text-xs text-rose-200 italic bg-red-950/60 p-2.5 rounded-xl border border-red-800">
                              "{req.note}"
                            </p>
                          )}

                          {req.meetLink && (
                            <div className="flex items-center gap-2 text-xs text-emerald-200 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-600">
                              <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span>Link Meet inviato al cliente:</span>
                              <a 
                                href={req.meetLink} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="font-mono text-amber-300 hover:underline truncate max-w-xs sm:max-w-md"
                              >
                                {req.meetLink}
                              </a>
                            </div>
                          )}
                        </div>

                        {/* PULSANTI DI DECISIONE & WHATSAPP AUTOMATICO */}
                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch gap-2 shrink-0">
                          
                          {/* 1. ACCETTA & INVIA LINK MEET */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openAcceptModal(req)}
                              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md"
                              title="Accetta e inserisci il link di Google Meet"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Accetta & Meet</span>
                            </button>
                            {isAccepted && (
                              <div className="flex items-center gap-1">
                                <a
                                  href={waAccettaLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl transition shadow-md flex items-center gap-1 text-[11px] font-bold"
                                  title="Invia o reinvia Link Meet su WhatsApp del cliente"
                                >
                                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                                  <span className="hidden sm:inline">WhatsApp</span>
                                </a>
                                <a
                                  href={emailAccettaLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-2 bg-red-950/80 hover:bg-red-900 text-amber-300 rounded-xl transition shadow-md border border-red-700 flex items-center gap-1 text-[11px] font-bold"
                                  title="Invia o reinvia Link Meet via Email al cliente"
                                >
                                  <Mail className="w-4 h-4 text-amber-400" />
                                  <span className="hidden sm:inline">Email</span>
                                </a>
                              </div>
                            )}
                          </div>

                          {/* 2. METTI IN ATTESA */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateCallRequestStatus(req.id, 'pending')}
                              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-red-950 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md"
                              title="Metti la richiesta in stato di attesa"
                            >
                              <Clock className="w-4 h-4" />
                              <span>In Attesa</span>
                            </button>
                            <a
                              href={waAttesaLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-amber-600 hover:bg-amber-500 text-red-950 rounded-xl transition shadow-md"
                              title="Invia messaggio WhatsApp: Richiesta in stato di attesa"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>

                          {/* 3. RIFIUTA */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateCallRequestStatus(req.id, 'rejected')}
                              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-rose-700 hover:bg-rose-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md"
                              title="Rifiuta la videochiamata"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>Rifiuta</span>
                            </button>
                            <a
                              href={waRifiutaLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-rose-800 hover:bg-rose-700 text-white rounded-xl transition shadow-md"
                              title="Invia messaggio WhatsApp: Rifiuto / Riprogramma"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>

                          {/* Cancella richiesta */}
                          <button
                            onClick={() => deleteCallRequest(req.id)}
                            className="p-2 text-rose-300 hover:text-white transition rounded-xl"
                            title="Rimuovi record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* CONTENUTO TAB 2: RUBRICA CLIENTI & ESPORTAZIONE PDF / EXCEL */}
        {activeTab === 'clients' && (
          <div className="space-y-4">
            
            {/* Barra Azioni Rubrica */}
            <div className="bg-red-900/80 border border-red-700/80 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              
              {/* Cerca */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-300" />
                <input
                  type="text"
                  placeholder="Cerca cliente per nome, telefono, email..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-red-950 border border-red-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-red-400 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Pulsanti Esporta Excel, Esporta PDF e Aggiungi */}
              <div className="flex items-center gap-2 flex-wrap">
                
                {/* SALVA IN EXCEL */}
                <button
                  onClick={() => exportClientsToExcel(clients)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md"
                  title="Scarica rubrica in formato Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Salva in Excel</span>
                </button>

                {/* SALVA IN PDF */}
                <button
                  onClick={() => exportClientsToPDF(clients)}
                  className="flex items-center gap-2 bg-rose-700 hover:bg-rose-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md"
                  title="Scarica rubrica in formato PDF stampabile"
                >
                  <FileText className="w-4 h-4" />
                  <span>Salva in PDF</span>
                </button>

                {/* Aggiungi Manualmente */}
                <button
                  onClick={() => setShowAddClientModal(true)}
                  className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-red-950 px-3.5 py-2 rounded-xl text-xs font-black transition shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuovo Cliente</span>
                </button>

                {/* Aggiorna Rubrica */}
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-1.5 bg-sky-700 hover:bg-sky-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                  title="Aggiorna la pagina per vedere gli ultimi iscritti"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Aggiorna</span>
                </button>

                {/* PULSANTE MANUALE CANCELLA RUBRICA */}
                <button
                  onClick={handleClearRubrica}
                  className="flex items-center gap-1.5 bg-red-950 hover:bg-rose-900 text-rose-200 hover:text-white border-2 border-rose-600/80 px-3.5 py-2 rounded-xl text-xs font-black transition shadow-md active:scale-95 cursor-pointer"
                  title="Cancella manualmente tutti i contatti della rubrica"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Cancella Rubrica</span>
                </button>

              </div>
            </div>

            {/* Tabella Rubrica Clienti */}
            <div className="bg-red-900/90 border border-red-700/80 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-red-950 text-amber-300 uppercase text-[11px] font-extrabold tracking-wider border-b border-red-800">
                    <tr>
                      <th className="py-3.5 px-4">#</th>
                      <th className="py-3.5 px-4">Nominativo</th>
                      <th className="py-3.5 px-4">Cellulare / WhatsApp</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Data Reg.</th>
                      <th className="py-3.5 px-4">Ultima Pratica</th>
                      <th className="py-3.5 px-4 text-center">Azioni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-800">
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-rose-300">
                          Nessun cliente in rubrica. La lista è vuota.
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client, index) => {
                        const waMsg = `Salve ${client.nome}, la contatto dal CAF Zero Carta di Bossa Rachele.`;
                        const waLink = getWhatsAppLink(client.cellulare, waMsg);

                        return (
                          <tr key={client.id || index} className="hover:bg-red-800/60 transition">
                            <td className="py-3 px-4 font-mono text-rose-300 text-xs">{index + 1}</td>
                            <td className="py-3 px-4 font-bold text-white">
                              {client.cognome} {client.nome}
                            </td>
                            <td className="py-3 px-4 text-amber-300 font-mono text-xs font-bold">
                              {client.cellulare}
                            </td>
                            <td className="py-3 px-4 text-rose-100 text-xs">
                              {client.email}
                            </td>
                            <td className="py-3 px-4 text-rose-200 text-xs">
                              {client.createdAt ? new Date(client.createdAt).toLocaleDateString('it-IT') : '-'}
                            </td>
                            <td className="py-3 px-4 text-white text-xs">
                              <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800">
                                {client.lastService || 'Accesso App'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {/* WhatsApp originale verde */}
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                                  title="Apri chat WhatsApp con il cliente"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`tel:${client.cellulare}`}
                                  className="p-1.5 bg-amber-500 hover:bg-amber-400 text-red-950 rounded-lg transition"
                                  title="Chiama telefonicamente"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                {/* Elimina Singolo Contatto */}
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Eliminare ${client.cognome} ${client.nome} dalla rubrica?`)) {
                                      deleteClient(client.id);
                                    }
                                  }}
                                  className="p-1.5 bg-red-950 hover:bg-rose-900 text-rose-300 hover:text-white rounded-lg transition border border-red-800 cursor-pointer"
                                  title="Elimina questo contatto dalla rubrica"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* CONTENUTO TAB 3: IMPOSTAZIONI & WHATSAPP */}
        {activeTab === 'settings' && (
          <div className="bg-red-900/90 border border-red-700/80 rounded-2xl p-6 max-w-2xl mx-auto space-y-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-red-800 pb-3">
              <SettingsIcon className="w-5 h-5 text-amber-400" />
              <span>Impostazioni App e Canali di Contatto</span>
            </h2>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              {/* Numero WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1.5">
                  Numero di Telefono & WhatsApp Assistenza *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    placeholder="3382174844"
                    className="w-full px-4 py-2.5 bg-red-950 border border-red-700 rounded-xl text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                  <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[11px] text-rose-200 mt-1">
                  Numero a cui vengono indirizzati i clienti per informazioni dirette via chat o chiamata (Default: <code>3382174844</code>).
                </p>
              </div>

              {/* Email Google Meet */}
              <div>
                <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1.5">
                  Email Ufficiale Google Meet per Videoconferenze *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={settingsForm.meetEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, meetEmail: e.target.value })}
                    placeholder="rachelebossazerocarta@gmail.it"
                    className="w-full px-4 py-2.5 bg-red-950 border border-red-700 rounded-xl text-sm text-white focus:border-amber-400 focus:outline-none"
                  />
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[11px] text-rose-200 mt-1">
                  Account a cui sono collegate le videochiamate Meet (Default: <code>rachelebossazerocarta@gmail.it</code>).
                </p>
              </div>

              {/* Link Stanza Meet predefinita */}
              <div>
                <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1.5">
                  URL Stanza Google Meet Predefinita
                </label>
                <input
                  type="url"
                  value={settingsForm.meetRoomUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, meetRoomUrl: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-4 py-2.5 bg-red-950 border border-red-700 rounded-xl text-sm text-white focus:border-amber-400 focus:outline-none"
                />
                <p className="text-[11px] text-rose-200 mt-1">
                  Puoi inserire un link di riunione fisso oppure lasciare <code>https://meet.google.com/new</code> per avviare una nuova stanza ad ogni appuntamento.
                </p>
              </div>

              {/* PIN di Accesso Amministratore */}
              <div>
                <label className="block text-xs font-bold text-rose-200 uppercase tracking-wider mb-1.5">
                  Codice PIN di Accesso Pannello Gestore
                </label>
                <input
                  type="password"
                  maxLength={10}
                  value={settingsForm.adminPin}
                  onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                  placeholder="••••••"
                  className="w-full px-4 py-2.5 bg-red-950 border border-red-700 rounded-xl text-sm text-amber-300 font-bold tracking-widest focus:border-amber-400 focus:outline-none"
                />
                <p className="text-[11px] text-rose-200 mt-1">
                  Codice PIN di sicurezza riservato per l'accesso esclusivo al pannello gestore.
                </p>
              </div>

              {settingsSaved && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Impostazioni aggiornate con successo!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-red-950 font-black py-3 px-4 rounded-xl transition shadow-lg"
              >
                Salva Modifiche Impostazioni
              </button>
            </form>
          </div>
        )}

      </div>

      {/* MODALE ACCETTAZIONE CON LINK MEET */}
      {activeMeetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-red-900 border-2 border-red-700 rounded-3xl p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-amber-300">
              <Video className="w-5 h-5 text-emerald-400" />
              <span>Accetta e Invia Link Google Meet al Cliente</span>
            </h3>
            
            <div className="bg-red-950/60 p-3 rounded-xl border border-red-800 text-xs text-rose-100 space-y-1">
              <p>Stai per accettare la videochiamata di: <strong className="text-white">{activeMeetModal.clientName}</strong></p>
              <p>Pratica richiesta: <strong className="text-amber-300">{activeMeetModal.serviceTitle}</strong></p>
              <p className="text-[11px] text-rose-300">
                Cellulare (WhatsApp): <strong className="text-white">{activeMeetModal.clientPhone}</strong> • Email: <strong className="text-white">{activeMeetModal.clientEmail}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-200 mb-1.5">
                Link Riunione Google Meet
              </label>
              <input
                type="url"
                value={customMeetLink}
                onChange={(e) => setCustomMeetLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full px-4 py-2.5 bg-red-950 border border-red-700 rounded-xl text-sm text-amber-300 focus:outline-none focus:border-amber-400"
              />
              <p className="text-[11px] text-rose-200 mt-1">
                Generata con account <code>{settings.meetEmail}</code>. Il link sarà attivo sia nell'app sia inviato ai recapiti del cliente.
              </p>
            </div>

            {/* SELEZIONE CANALI DI INVIO AL CLIENTE */}
            <div className="bg-red-950/90 border-2 border-red-700/80 p-3.5 rounded-2xl space-y-2.5">
              <p className="text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Invia il Link di Meet al Cliente Tramite:</span>
              </p>

              {/* Canale WhatsApp */}
              <label className="flex items-center gap-2.5 text-xs text-rose-100 cursor-pointer p-2 rounded-xl bg-red-900/50 hover:bg-red-900 border border-red-700/60 transition">
                <input 
                  type="checkbox" 
                  checked={sendViaWhatsApp} 
                  onChange={(e) => setSendViaWhatsApp(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-red-950 border-red-700" 
                />
                <span className="flex items-center gap-1.5 font-bold">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Invia su WhatsApp al <strong className="text-white">{activeMeetModal.clientPhone}</strong></span>
                </span>
              </label>

              {/* Canale Email */}
              <label className="flex items-center gap-2.5 text-xs text-rose-100 cursor-pointer p-2 rounded-xl bg-red-900/50 hover:bg-red-900 border border-red-700/60 transition">
                <input 
                  type="checkbox" 
                  checked={sendViaEmail} 
                  onChange={(e) => setSendViaEmail(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-400 focus:ring-amber-500 bg-red-950 border-red-700" 
                />
                <span className="flex items-center gap-1.5 font-bold">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Invia via Email a <strong className="text-white">{activeMeetModal.clientEmail}</strong></span>
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveMeetModal(null)}
                className="px-4 py-2 text-xs font-bold text-rose-200 hover:text-white"
              >
                Annulla
              </button>
              <button
                onClick={confirmAcceptWithMeet}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-900/40 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Conferma ed Invia Link Meet (WhatsApp + Email)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE AGGIUNGI CLIENTE MANUALE */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-red-900 border-2 border-red-700 rounded-3xl p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-amber-300">
              <Users className="w-5 h-5" />
              <span>Inserisci Nuovo Cliente in Rubrica</span>
            </h3>

            <form onSubmit={handleAddClientSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-rose-200 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={newClientData.nome}
                  onChange={(e) => setNewClientData({ ...newClientData, nome: e.target.value })}
                  className="w-full px-3 py-2 bg-red-950 border border-red-700 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-rose-200 mb-1">Cognome *</label>
                <input
                  type="text"
                  required
                  value={newClientData.cognome}
                  onChange={(e) => setNewClientData({ ...newClientData, cognome: e.target.value })}
                  className="w-full px-3 py-2 bg-red-950 border border-red-700 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-rose-200 mb-1">Cellulare / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={newClientData.cellulare}
                  onChange={(e) => setNewClientData({ ...newClientData, cellulare: e.target.value })}
                  className="w-full px-3 py-2 bg-red-950 border border-red-700 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-rose-200 mb-1">Email</label>
                <input
                  type="email"
                  value={newClientData.email}
                  onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-red-950 border border-red-700 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-rose-200 mb-1">Pratica / Servizio</label>
                <input
                  type="text"
                  placeholder="Es. Modello 730"
                  value={newClientData.lastService}
                  onChange={(e) => setNewClientData({ ...newClientData, lastService: e.target.value })}
                  className="w-full px-3 py-2 bg-red-950 border border-red-700 rounded-xl text-sm text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 text-xs font-bold text-rose-200 hover:text-white"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-red-950 text-xs font-black shadow-md"
                >
                  Salva Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
