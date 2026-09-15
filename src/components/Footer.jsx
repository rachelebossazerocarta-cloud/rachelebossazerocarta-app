import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MessageCircle, Lock, ShieldCheck, MapPin, Clock } from 'lucide-react';

export default function Footer({ onOpenPinModal, onOpenRegistration }) {
  const { settings, currentClient, getWhatsAppLink } = useApp();

  const handlePhoneClick = (e) => {
    e.preventDefault();
    if (!currentClient) {
      onOpenRegistration?.(() => {
        window.location.href = `tel:${settings.whatsappNumber}`;
      });
      return;
    }
    window.location.href = `tel:${settings.whatsappNumber}`;
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    if (!currentClient) {
      onOpenRegistration?.((client) => {
        const url = getWhatsAppLink(settings.whatsappNumber, `Salve, sono ${client.nome} ${client.cognome}.`);
        window.open(url, '_blank');
      });
      return;
    }
    const url = getWhatsAppLink(settings.whatsappNumber, `Salve, sono ${currentClient.nome} ${currentClient.cognome}.`);
    window.open(url, '_blank');
  };

  return (
    <footer className="bg-red-950 text-rose-200 pt-16 pb-28 border-t-2 border-red-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Colonna 1: Branding */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg border border-red-200">
                <img src="/logo.png" alt="Logo Zero Carta" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">Zero Carta</h3>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">di Bossa Rachele</p>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-rose-100 max-w-sm leading-relaxed">
              Il tuo Patronato e CAF digitale a portata di clic. Ti aiutiamo a compilare e gestire tutte le tue pratiche burocratiche senza bisogno di venire fisicamente in sede, attraverso videoconferenze dirette Google Meet e assistenza su WhatsApp.
            </p>

            {/* Sede fisica in evidenza */}
            <div className="flex items-center gap-2 text-xs text-amber-200 bg-red-900/60 p-2.5 rounded-xl border border-red-700/80 max-w-sm">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Sede fisica: <strong className="text-white">Afragola in Via Piersanti Mattarella 30</strong></span>
            </div>

            <div className="flex items-center gap-2 text-xs text-rose-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Pratiche gestite nel rispetto della privacy (GDPR) e con canali crittografati.</span>
            </div>
          </div>

          {/* Colonna 2: Contatti Ufficiali */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Recapiti & Assistenza</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Sede fisica: <strong className="text-white font-semibold">Via Piersanti Mattarella 30, Afragola</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Tel: <button onClick={handlePhoneClick} className="text-white hover:text-amber-300 underline font-semibold cursor-pointer">{settings.whatsappNumber}</button></span>
              </li>
              <li className="flex items-center gap-2">
                {/* Icona WhatsApp originale verde */}
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>WhatsApp: <button onClick={handleWhatsAppClick} className="text-white hover:text-emerald-300 underline font-semibold cursor-pointer">{settings.whatsappNumber}</button></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Email: <a href={`mailto:${settings.meetEmail}`} className="text-white hover:text-amber-300 underline font-semibold">{settings.meetEmail}</a></span>
              </li>
              <li className="text-rose-200 pt-2 border-t border-red-850 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Giorni e Orari di Apertura:</span>
                </div>
                <div className="pl-5 space-y-0.5 text-[11px] text-rose-100 font-medium">
                  <p><strong>Lun - Ven:</strong> 09:00 - 12:00 e 16:30 - 18:30</p>
                  <p><strong>Sabato:</strong> 09:00 - 12:00</p>
                  <p className="text-rose-300 text-[10px]">Domenica: Chiuso</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Colonna 3: Gestore e PIN */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Area Riservata Gestore</h4>
            <p className="text-xs text-rose-200">
              Accesso esclusivo per <strong>Bossa Rachele</strong> per gestire richieste di videochiamata, stato online/offline e scaricare la rubrica in Excel/PDF.
            </p>
            <button
              onClick={onOpenPinModal}
              className="inline-flex items-center gap-2 bg-red-900/80 hover:bg-red-900 text-amber-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-extrabold border border-amber-500/40 shadow-md transition"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Accedi al Pannello Gestore</span>
            </button>
          </div>

        </div>

        {/* Informativa Piè di Pagina */}
        <div className="my-8 p-4 rounded-2xl bg-red-900/70 border-2 border-amber-400/60 text-center max-w-2xl mx-auto shadow-lg">
          <p className="text-xs sm:text-sm text-amber-200 font-bold leading-relaxed">
            ℹ️ Questa è un'app di <strong className="text-white uppercase tracking-wide">prenotazione e consulenza on line</strong> per i servizi CAF e Patronato di Zero Carta di Bossa Rachele.
          </p>
        </div>

        <div className="pt-8 border-t border-red-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rose-300">
          <p>© {new Date().getFullYear()} Zero Carta di Bossa Rachele • Sede fisica ad Afragola in Via Piersanti Mattarella 30 • Tutti i diritti riservati.</p>
          <p className="flex items-center gap-1.5 text-amber-300 font-extrabold bg-red-900/90 px-3.5 py-1.5 rounded-full border border-red-700 shadow-xs">
            <span>App di prenotazione e consulenza on line</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
