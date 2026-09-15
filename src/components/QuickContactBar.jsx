import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Phone, Video } from 'lucide-react';

export default function QuickContactBar({ onScrollToBooking, onOpenRegistration }) {
  const { settings, currentClient, getWhatsAppLink } = useApp();

  const handleWhatsAppDirect = () => {
    if (!currentClient) {
      onOpenRegistration?.((client) => {
        const text = `Salve, sono ${client.nome} ${client.cognome}. Vorrei richiedere informazioni sulle pratiche del Patronato e CAF Zero Carta di Bossa Rachele.`;
        const url = getWhatsAppLink(settings.whatsappNumber, text);
        window.open(url, '_blank');
      });
      return;
    }
    const greeting = `Salve, sono ${currentClient.nome} ${currentClient.cognome}.`;
    const text = `${greeting} Vorrei richiedere informazioni sulle pratiche del Patronato e CAF Zero Carta di Bossa Rachele.`;
    const url = getWhatsAppLink(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  const handlePhoneDirect = () => {
    if (!currentClient) {
      onOpenRegistration?.(() => {
        window.location.href = `tel:${settings.whatsappNumber}`;
      });
      return;
    }
    window.location.href = `tel:${settings.whatsappNumber}`;
  };

  return (
    <aside aria-label="Contatti Rapidi" className="fixed bottom-4 left-4 right-4 z-30 max-w-2xl mx-auto pointer-events-none">
      <div className="bg-red-950/95 backdrop-blur-md text-white p-2.5 sm:p-3 rounded-2xl sm:rounded-full border-2 border-red-700/80 shadow-2xl flex items-center justify-between gap-2 pointer-events-auto">
        
        {/* Badge Stato Operatore */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-900/90 border border-red-700 text-xs">
          <span className={`w-2.5 h-2.5 rounded-full ${settings.isOnline ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`}></span>
          <span className="hidden sm:inline font-bold text-rose-100">
            {settings.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Pulsanti Azione Rapida */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          
          {/* WhatsApp Rapido - Richiede Registrazione Obbligatoria */}
          <button
            onClick={handleWhatsAppDirect}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl sm:rounded-full text-xs font-extrabold shadow-md shadow-emerald-950/40 transition transform active:scale-95"
            title={`Scrivi su WhatsApp al ${settings.whatsappNumber}`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-100" />
            <span>WhatsApp</span>
            <span className="hidden md:inline text-[11px] opacity-90">({settings.whatsappNumber})</span>
          </button>

          {/* Chiamata Rapida - Richiede Registrazione Obbligatoria */}
          <button
            onClick={handlePhoneDirect}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-red-950 px-3.5 py-2 rounded-xl sm:rounded-full text-xs font-black shadow-md transition transform active:scale-95"
            title={`Chiama il numero ${settings.whatsappNumber}`}
          >
            <Phone className="w-4 h-4 text-red-900" />
            <span>Chiama</span>
            <span className="hidden md:inline text-[11px] opacity-90">({settings.whatsappNumber})</span>
          </button>

          {/* Scorciatoia Videochiamata - Tonalità Rubino regale */}
          <button
            onClick={onScrollToBooking}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white px-3.5 py-2 rounded-xl sm:rounded-full text-xs font-extrabold shadow-md border border-red-500/50 transition transform active:scale-95"
            title="Apri o prenota videochiamata"
          >
            <Video className="w-4 h-4 text-rose-200" />
            <span className="hidden sm:inline">Videochiamata</span>
          </button>

        </div>

      </div>
    </aside>
  );
}
