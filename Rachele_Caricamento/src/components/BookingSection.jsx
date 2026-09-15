import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CAF_SERVICES } from '../data/cafServices';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  UserCheck, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send,
  Radio
} from 'lucide-react';

// Orari ufficiali: Lun-Ven 09:00-12:00 e 16:30-18:30 • Sabato 09:00-12:00
const WEEKDAY_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
  '16:30', '17:00', '17:30', '18:00', '18:30'
];

const SATURDAY_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00'
];

export default function BookingSection({ selectedService, onOpenRegistration }) {
  const { 
    settings, 
    currentClient, 
    callRequests, 
    createCallRequest, 
    isSlotBooked 
  } = useApp();

  // Tab: 'schedule' (Prenota Data e Ora) o 'instant' (Videochiamata Adesso)
  const [bookingType, setBookingType] = useState('schedule');
  
  // Generazione prossimi 10 giorni lavorativi per il selettore date
  const generateAvailableDates = () => {
    const dates = [];
    let current = new Date();
    while (dates.length < 10) {
      if (current.getDay() !== 0) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        const iso = `${year}-${month}-${day}`;
        const label = current.toLocaleDateString('it-IT', {
          weekday: 'short',
          day: '2-digit',
          month: 'short'
        });
        dates.push({ iso, label, isToday: dates.length === 0 });
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  const [selectedDate, setSelectedDate] = useState(availableDates[0]?.iso || '');
  const [selectedTime, setSelectedTime] = useState('');
  const [chosenServiceId, setChosenServiceId] = useState(selectedService?.id || CAF_SERVICES[0].id);
  const [userNote, setUserNote] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Timestamp live per l'aggiornamento automatico e continuo dell'ora reale
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 15000); // Ricalcola ogni 15 secondi
    return () => clearInterval(interval);
  }, []);

  // Verifica in automatico se un orario è già trascorso rispetto all'ora effettiva attuale
  const isSlotInPast = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return false;
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      const slotTime = new Date(year, month - 1, day, hours, minutes, 0, 0).getTime();
      return slotTime <= currentTimestamp;
    } catch {
      return false;
    }
  };

  // Se l'orario precedentemente selezionato scade mentre l'utente è sulla pagina, deselezionalo in automatico
  useEffect(() => {
    if (selectedTime && isSlotInPast(selectedDate, selectedTime)) {
      setSelectedTime('');
    }
  }, [selectedDate, selectedTime, currentTimestamp]);

  // Trova le richieste del cliente corrente
  const clientRequests = currentClient 
    ? callRequests.filter(r => r.clientId === currentClient.id || r.clientEmail === currentClient.email)
    : [];

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFeedbackMsg('');

    if (!currentClient) {
      onOpenRegistration();
      return;
    }

    const serviceObj = CAF_SERVICES.find(s => s.id === chosenServiceId) || { title: 'Consulenza Generale CAF' };

    if (bookingType === 'schedule') {
      if (!selectedDate || !selectedTime) {
        setErrorMsg('Seleziona sia la data che la fascia oraria desiderata.');
        return;
      }

      if (isSlotInPast(selectedDate, selectedTime)) {
        setErrorMsg('Questa fascia oraria è già trascorsa. Seleziona un orario successivo.');
        return;
      }

      if (isSlotBooked(selectedDate, selectedTime)) {
        setErrorMsg('Questo orario è già stato prenotato. Seleziona un altro slot disponibile.');
        return;
      }

      try {
        createCallRequest({
          serviceId: chosenServiceId,
          serviceTitle: serviceObj.title,
          type: 'scheduled',
          scheduledDate: selectedDate,
          scheduledTime: selectedTime,
          note: userNote
        });

        setFeedbackMsg(`Prenotazione registrata con successo per il ${selectedDate} alle ${selectedTime}! Non appena Bossa Rachele accetterà la richiesta, riceverai il link di Google Meet direttamente sul tuo WhatsApp (${currentClient.cellulare}) e sulla tua Email (${currentClient.email}).`);
        setSelectedTime('');
        setUserNote('');
      } catch (err) {
        setErrorMsg(err.message || 'Errore durante la prenotazione.');
      }
    } else {
      try {
        createCallRequest({
          serviceId: chosenServiceId,
          serviceTitle: serviceObj.title,
          type: 'instant',
          note: userNote || 'Richiesta videochiamata immediata da cliente online'
        });

        setFeedbackMsg(`Richiesta inviata a Bossa Rachele! Non appena verrà accettata, riceverai il link di Google Meet direttamente sul tuo WhatsApp (${currentClient.cellulare}) e sulla tua Email (${currentClient.email}).`);
        setUserNote('');
      } catch (err) {
        setErrorMsg(err.message || 'Errore nella richiesta.');
      }
    }
  };

  return (
    <section id="prenotazioni" className="py-16 bg-gradient-to-b from-red-850 via-red-900 to-rose-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intestazione */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
            <Video className="w-3.5 h-3.5 text-amber-400" />
            <span>Videoconferenze & Prenotazioni Online</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Prenota la tua Videochiamata con Google Meet
          </h2>
          <p className="mt-3 text-sm sm:text-base text-rose-100">
            Assistenza diretta con <strong>Bossa Rachele</strong> collegata all'account ufficiale <code>{settings.meetEmail}</code>. Compila e risolvi le tue pratiche CAF comodamente a distanza.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-400 text-red-950 text-xs sm:text-sm font-bold shadow-md">
            <span className="font-black uppercase tracking-wider">Nota Bene:</span>
            <span>Per usufruire del servizio di video call con Meet di Google, <strong>bisogna avere una Gmail</strong>.</span>
          </div>
        </div>

        {/* NOTIFICHE DI STATO RICHIESTE ATTIVE DEL CLIENTE */}
        {clientRequests.length > 0 && (
          <div className="mb-10 max-w-4xl mx-auto">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Le Tue Richieste di Videochiamata in Corso</span>
            </h3>

            <div className="space-y-4">
              {clientRequests.map(req => (
                <div 
                  key={req.id}
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    req.status === 'accepted' 
                      ? 'bg-emerald-50 border-emerald-400 shadow-lg text-slate-800'
                      : req.status === 'rejected'
                      ? 'bg-rose-50 border-rose-300 text-slate-800'
                      : 'bg-amber-50 border-amber-300 shadow-md text-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                          req.status === 'accepted'
                            ? 'bg-emerald-600 text-white'
                            : req.status === 'rejected'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-600 text-white'
                        }`}>
                          {req.status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {req.status === 'rejected' && <AlertCircle className="w-3.5 h-3.5" />}
                          {req.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                          <span>
                            {req.status === 'accepted' ? 'Fase di Esecuzione / Accettata' :
                             req.status === 'rejected' ? 'Richiesta Rifiutata' :
                             'In Stato di Attesa'}
                          </span>
                        </span>

                        <span className="text-xs text-slate-600 font-bold">
                          {req.type === 'instant' ? 'Videochiamata Istantanea' : `Data: ${req.scheduledDate} ore ${req.scheduledTime}`}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-slate-900">
                        {req.serviceTitle}
                      </h4>

                      <p className="text-xs text-slate-600 mt-1">
                        {req.status === 'accepted' && 'Il gestore Bossa Rachele ha approvato il collegamento. Puoi entrare nella stanza virtuale con il pulsante qui a fianco!'}
                        {req.status === 'pending' && 'La tua richiesta è stata notificata al gestore del pannello. Attendi che venga generato e inviato il link di Meet su WhatsApp ed Email.'}
                        {req.status === 'rejected' && 'La richiesta non è stata accettata per l\'orario indicato. Puoi effettuare una nuova prenotazione.'}
                      </p>

                      {req.status === 'accepted' && (
                        <div className="mt-2.5 p-3 rounded-xl bg-emerald-100/90 border border-emerald-400 text-xs text-emerald-950 space-y-1">
                          <div className="flex items-center gap-1.5 font-black text-emerald-900">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>Link Google Meet inviato su WhatsApp ({req.clientPhone}) e via Email ({req.clientEmail})!</span>
                          </div>
                          <p className="text-[11px] text-emerald-800">
                            Puoi avviare subito la videochiamata con il pulsante verde a destra, oppure aprire comodamente il link ricevuto sul tuo cellulare.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottone Avvia Videochiamata Google Meet quando ACCETTATA */}
                    {req.status === 'accepted' && (
                      <div className="shrink-0">
                        <a
                          href={req.meetLink || settings.meetRoomUrl || 'https://meet.google.com/new'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-black text-sm shadow-lg shadow-emerald-700/40 hover:shadow-xl transition transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <Video className="w-5 h-5 text-emerald-100" />
                          <span>Accetta e Avvia Videochiamata Meet</span>
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      </div>
                    )}

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULO DI PRENOTAZIONE (Scheda Bianca con rifiniture rosse ed oro) */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border-2 border-red-200 p-6 sm:p-8 lg:p-10 shadow-2xl text-slate-800">
          
          {/* Selettore Modalità: Prenota per Data/Ora o Videochiamata Istantanea */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => setBookingType('schedule')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl font-black text-sm transition-all ${
                bookingType === 'schedule'
                  ? 'bg-red-700 text-white shadow-md shadow-red-900/30 border-2 border-red-600'
                  : 'bg-red-50 text-red-950 border border-red-200 hover:bg-red-100'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Programma per Data & Ora</span>
            </button>

            <button
              type="button"
              onClick={() => setBookingType('instant')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl font-black text-sm transition-all ${
                bookingType === 'instant'
                  ? 'bg-red-700 text-white shadow-md shadow-red-900/30 border-2 border-red-600'
                  : 'bg-red-50 text-red-950 border border-red-200 hover:bg-red-100'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Videochiamata Istantanea ORA</span>
              {settings.isOnline ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                  Online
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800">
                  Offline
                </span>
              )}
            </button>
          </div>

          {/* Se il cliente non è ancora registrato, avviso chiaro */}
          {!currentClient && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start justify-between gap-3 text-amber-950 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Attenzione: Registrazione Richiesta</p>
                  <p className="text-amber-900 text-xs mt-0.5">
                    Per poter prenotare o avviare la videochiamata con Bossa Rachele, inserisci i tuoi dati (nome, cognome, cellulare ed email).
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenRegistration}
                className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition"
              >
                Registrati Ora
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            
            {/* Scelta Pratica / Servizio */}
            <div>
              <label className="block text-xs font-bold text-red-950 uppercase tracking-wider mb-2">
                1. Seleziona il Servizio CAF per la Videochiamata *
              </label>
              <select
                value={chosenServiceId}
                onChange={(e) => setChosenServiceId(e.target.value)}
                className="w-full bg-red-50/40 border-2 border-red-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 font-bold text-slate-800"
              >
                {CAF_SERVICES.map(srv => (
                  <option key={srv.id} value={srv.id}>
                    {srv.title} ({srv.badge})
                  </option>
                ))}
              </select>
            </div>

            {/* SEZIONE CALENDARIO E ORARI (Se 'schedule') */}
            {bookingType === 'schedule' && (
              <div className="space-y-6 border-t border-red-100 pt-6">
                
                {/* 2. Scelta Data */}
                <div>
                  <label className="block text-xs font-bold text-red-950 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-red-700" />
                    <span>2. Scegli il Giorno Disponibile</span>
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {availableDates.map(d => {
                      const isSelected = selectedDate === d.iso;
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => {
                            setSelectedDate(d.iso);
                            setSelectedTime('');
                          }}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            isSelected
                              ? 'bg-red-700 text-white border-red-700 shadow-md font-extrabold'
                              : 'bg-white hover:bg-red-50 border-red-200 text-slate-800 font-semibold'
                          }`}
                        >
                          <div className="text-[11px] uppercase tracking-wider opacity-80">{d.label.split(' ')[0]}</div>
                          <div className="text-base font-extrabold mt-0.5">{d.label.split(' ')[1]} {d.label.split(' ')[2]}</div>
                          {d.isToday && (
                            <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold">
                              Oggi
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Scelta Orario con Verifica Disponibilità */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold text-red-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-red-700" />
                      <span>3. Fascia Oraria (Disponibilità in Tempo Reale) *</span>
                    </label>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Disponibile
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Non disponibile (Passato / Occupato)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
                    {(() => {
                      const isSaturday = selectedDate ? new Date(selectedDate + 'T00:00:00').getDay() === 6 : false;
                      const slots = isSaturday ? SATURDAY_SLOTS : WEEKDAY_SLOTS;

                      return slots.map(time => {
                        const isPast = isSlotInPast(selectedDate, time);
                        const booked = isSlotBooked(selectedDate, time);
                        const isUnavailable = isPast || booked;
                        const isSelected = selectedTime === time;

                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={isUnavailable}
                            onClick={() => setSelectedTime(time)}
                            title={
                              isPast 
                                ? `${time} - Non disponibile (Orario già trascorso)` 
                                : booked 
                                ? `${time} - Non disponibile (Già prenotato)` 
                                : `${time} - Disponibile`
                            }
                            className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all relative ${
                              isUnavailable
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through opacity-60 select-none'
                                : isSelected
                                ? 'bg-red-700 text-white border-red-700 shadow-md font-black ring-2 ring-red-300'
                                : 'bg-white hover:bg-red-50 border-red-200 text-red-950 font-bold hover:border-red-400'
                            }`}
                          >
                            <span>{time}</span>
                            {isUnavailable && (
                              <span 
                                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white"
                                title={isPast ? "Orario trascorso" : "Già prenotato"}
                              ></span>
                            )}
                          </button>
                        );
                      });
                    })()}
                  </div>

                  {/* Avviso se tutti gli orari odierni sono passati/occupati */}
                  {(() => {
                    const isSaturday = selectedDate ? new Date(selectedDate + 'T00:00:00').getDay() === 6 : false;
                    const slots = isSaturday ? SATURDAY_SLOTS : WEEKDAY_SLOTS;
                    const allUnavailable = slots.every(t => isSlotInPast(selectedDate, t) || isSlotBooked(selectedDate, t));

                    if (allUnavailable) {
                      return (
                        <div className="mt-2.5 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 font-bold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Tutte le fasce orarie per questa giornata sono già trascorse o occupate. Ti invitiamo a selezionare un'altra data dal calendario in alto.</span>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <p className="text-[11px] text-slate-600 mt-2 font-semibold">
                    {selectedDate && new Date(selectedDate + 'T00:00:00').getDay() === 6
                      ? '📅 Orario Sabato: dalle ore 09:00 alle ore 12:00.'
                      : '📅 Orario Lunedì - Venerdì: dalle 09:00 alle 12:00 e dalle 16:30 alle 18:30.'}
                  </p>

                  {selectedTime && (
                    <div className="mt-2.5 text-xs text-red-900 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Orario selezionato: {selectedDate} alle {selectedTime} (Disponibile)</span>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* SEZIONE VIDEOCHIAMATA ISTANTANEA (Se 'instant') */}
            {bookingType === 'instant' && (
              <div className="border-t border-red-100 pt-6 space-y-4">
                <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${
                  settings.isOnline 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}>
                  <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${settings.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`}></div>
                  <div>
                    <h4 className="font-extrabold text-sm">
                      {settings.isOnline ? 'Bossa Rachele è Attualmente ON-LINE' : 'Bossa Rachele è Attualmente OFF-LINE'}
                    </h4>
                    <p className="text-xs mt-0.5 leading-relaxed">
                      {settings.isOnline 
                        ? 'Puoi inviare la richiesta di videochiamata istantanea. Bossa Rachele la riceverà in tempo reale sul suo pannello e ti invierà il link di Google Meet.'
                        : 'Al momento l\'operatore non è disponibile per chiamate immediate. Ti suggeriamo di programmare una data e ora con la scheda "Programma per Data & Ora" oppure di scrivere su WhatsApp al 338 2174844.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Note Aggiuntive */}
            <div>
              <label className="block text-xs font-bold text-red-950 uppercase tracking-wider mb-2">
                Note o Domande Particolari (Facoltativo)
              </label>
              <textarea
                rows="2"
                placeholder="Es. Vorrei chiarimenti sul calcolo ISEE per l'università di mio figlio..."
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                className="w-full bg-red-50/30 border-2 border-red-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500"
              ></textarea>
            </div>

            {/* Messaggi di feedback */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {feedbackMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            {/* Pulsante Conferma */}
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-red-950 font-black py-4 px-6 rounded-2xl shadow-xl shadow-amber-950/20 hover:shadow-2xl transition transform active:scale-98 text-base flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5 text-red-900" />
                <span>
                  {bookingType === 'schedule' ? 'Conferma Prenotazione Videochiamata' : 'Invia Richiesta Videochiamata Immediata'}
                </span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
}
