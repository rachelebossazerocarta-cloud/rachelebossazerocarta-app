import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAF_SERVICES, CAF_CATEGORIES } from '../data/cafServices';
import { 
  Search, 
  FileText, 
  CheckCircle2, 
  MessageCircle, 
  Video, 
  ChevronRight, 
  X,
  Sparkles,
  ReceiptText,
  BadgePercent,
  Landmark,
  HandHeart,
  Users,
  HeartPulse,
  Briefcase,
  Globe,
  Home
} from 'lucide-react';

const ICONS_MAP = {
  Sparkles,
  ReceiptText,
  BadgePercent,
  Landmark,
  HandHeart,
  Users,
  HeartPulse,
  Briefcase,
  Globe,
  Home
};

export default function ServicesSection({ onSelectServiceForBooking, onOpenRegistration }) {
  const { settings, currentClient, getWhatsAppLink } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalService, setActiveModalService] = useState(null);

  // Filtro servizi per categoria e testo ricerca
  const filteredServices = CAF_SERVICES.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookService = (service) => {
    setActiveModalService(null);
    onSelectServiceForBooking(service);
  };

  const handleWhatsAppInquiry = (service) => {
    if (!currentClient) {
      onOpenRegistration?.((client) => {
        const text = `Salve, sono ${client.nome} ${client.cognome}. Vorrei avere informazioni e assistenza per la pratica: "${service.title}" presso il vostro CAF Zero Carta di Bossa Rachele.`;
        const url = getWhatsAppLink(settings.whatsappNumber, text);
        window.open(url, '_blank');
      });
      return;
    }
    const clientGreeting = `Salve, sono ${currentClient.nome} ${currentClient.cognome}.`;
    const text = `${clientGreeting} Vorrei avere informazioni e assistenza per la pratica: "${service.title}" presso il vostro CAF Zero Carta di Bossa Rachele.`;
    const url = getWhatsAppLink(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  return (
    <section id="servizi-caf" className="py-16 bg-gradient-to-b from-red-900 via-red-850 to-red-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intestazione Sezione */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tutti i Servizi CAF & Patronato</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Pratiche e Consulenza Online Senza Spostarsi da Casa
          </h2>
          <p className="mt-3 text-sm sm:text-base text-rose-100">
            Svolgi qualsiasi pratica con il supporto diretto di <strong>Bossa Rachele</strong>. Scegli il servizio, consulta i documenti necessari e richiedi assistenza o avvia una videochiamata.
          </p>
        </div>

        {/* Barra di Ricerca */}
        <div className="mb-10 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
            <input
              type="text"
              placeholder="Cerca un servizio (es. 730, ISEE, Pensione, Disoccupazione, Assegno Unico...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white text-red-950 placeholder:text-red-300 border-2 border-red-300 text-sm shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-400/30 focus:border-amber-400 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Griglia Servizi */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-red-950/80 rounded-3xl border border-red-700 p-8 max-w-md mx-auto shadow-xl text-white">
            <Search className="w-12 h-12 text-rose-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Nessun servizio trovato</h3>
            <p className="text-xs text-rose-200 mt-1">
              Prova con un altro termine di ricerca (es. 730, ISEE, Pensione, Disoccupazione...).
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-xs font-bold text-amber-400 hover:underline"
            >
              Mostra tutti i servizi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border-2 border-red-100 shadow-xl hover:shadow-2xl hover:border-red-300 transition-all duration-300 flex flex-col justify-between group overflow-hidden text-slate-800"
              >
                <div className="p-6">
                  {/* Badge & Categoria */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-red-50 border border-red-200 text-red-800 text-[11px] font-bold tracking-wide">
                      {service.badge}
                    </span>
                    <span className="text-[11px] text-red-500 font-bold uppercase tracking-wider">
                      {service.category}
                    </span>
                  </div>

                  {/* Titolo e Sintesi */}
                  <h3 className="text-lg font-black text-red-950 group-hover:text-red-700 transition leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {service.summary}
                  </p>

                  {/* Documenti preview badge */}
                  <div className="mt-4 pt-3 border-t border-red-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-red-800">
                      <FileText className="w-3.5 h-3.5 text-red-600" />
                      {service.documents.length} documenti richiesti
                    </span>
                    <button
                      onClick={() => setActiveModalService(service)}
                      className="text-red-700 hover:text-red-900 font-extrabold hover:underline flex items-center gap-0.5"
                    >
                      Dettagli &gt;
                    </button>
                  </div>
                </div>

                {/* Azioni Rapide Card */}
                <div className="bg-red-50/60 p-3.5 border-t border-red-100 flex items-center gap-2">
                  {/* WhatsApp originale verde */}
                  <button
                    onClick={() => handleWhatsAppInquiry(service)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl text-xs font-extrabold shadow-sm transition"
                    title="Chiedi informazioni via WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-100" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleBookService(service)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-800 hover:to-rose-800 text-white py-2.5 px-3 rounded-xl text-xs font-extrabold shadow-sm transition"
                    title="Prenota Videochiamata per questa pratica"
                  >
                    <Video className="w-3.5 h-3.5 text-rose-200" />
                    <span>Videochiamata</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modale Dettagli Pratica & Checklist Documenti */}
        {activeModalService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-fade-in text-slate-800">
            <div 
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-red-200 overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modale */}
              <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 p-6 text-white relative">
                <button
                  onClick={() => setActiveModalService(null)}
                  className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="pr-8">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-white/20 text-white text-xs font-bold mb-2">
                    {activeModalService.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {activeModalService.title}
                  </h3>
                  <p className="text-rose-100 text-xs mt-1 font-medium">
                    Zero Carta di Bossa Rachele • Scheda Informativa Pratica
                  </p>
                </div>
              </div>

              {/* Contenuto Scrollabile */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                
                {/* Spiegazione */}
                <div>
                  <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-2">
                    Come Funziona & Descrizione
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed bg-red-50/40 p-4 rounded-2xl border border-red-100">
                    {activeModalService.description}
                  </p>
                </div>

                {/* Checklist Documenti Necessari */}
                <div>
                  <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    <span>Documenti Necessari da Preparare per la Pratica</span>
                  </h4>
                  <div className="space-y-2.5">
                    {activeModalService.documents.map((doc, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100 text-xs sm:text-sm text-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span className="leading-snug font-medium">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggerimento */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950">
                  <p className="font-bold mb-0.5">Non hai tutti i documenti a portata di mano?</p>
                  <p>
                    Non preoccuparti: avvia o prenota la videochiamata con <strong>Bossa Rachele</strong> per analizzare insieme la tua situazione e verificare i passaggi necessari.
                  </p>
                </div>

              </div>

              {/* Footer Azioni Modale */}
              <div className="p-4 sm:p-6 bg-red-50/60 border-t border-red-100 flex flex-col sm:flex-row items-center gap-3">
                {/* WhatsApp rimane originale verde */}
                <button
                  onClick={() => handleWhatsAppInquiry(activeModalService)}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl font-extrabold text-sm shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-100" />
                  <span>Richiedi su WhatsApp</span>
                </button>

                <button
                  onClick={() => handleBookService(activeModalService)}
                  className="w-full sm:w-1/2 flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white py-3 px-4 rounded-xl font-extrabold text-sm shadow-md transition"
                >
                  <Video className="w-4 h-4 text-rose-200" />
                  <span>Prenota Videochiamata Meet</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
