import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Video, 
  FileCheck2, 
  MessageCircle, 
  Shield, 
  Sparkles, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  MapPin,
  AlertCircle
} from 'lucide-react';

export default function HeroSection({ onOpenRegistration, onScrollToServices, onScrollToBooking }) {
  const { settings, currentClient, getWhatsAppLink } = useApp();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -24;
    setTilt({ x, y });
  };

  const resetTilt = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleWhatsApp = () => {
    const text = 'Salve, desidero ricevere maggiori informazioni sui servizi del CAF Zero Carta di Bossa Rachele.';
    const url = getWhatsAppLink(settings.whatsappNumber, text);
    window.open(url, '_blank');
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-20 bg-gradient-to-b from-red-900 via-red-800 to-red-900 text-white">
      
      {/* Elementi di sfondo grafici sfumati caldi (rubino / ambra) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-rose-500/20 via-red-600/30 to-amber-500/15 blur-3xl -z-10 pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Colonna Sinistra: Testi e CTA */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/70 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Patronato & CAF Digitale per Tutta Italia</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Pratiche CAF e Patronato Online con{' '}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
                Zero Carta
              </span>
            </h1>

            {/* Sede Fisica ad Afragola sotto alla dicitura */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-red-950/90 border-2 border-amber-400/60 text-amber-300 text-xs sm:text-sm font-black shadow-lg">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Sede fisica: <span className="text-white">Afragola in Via Piersanti Mattarella 30</span></span>
            </div>

            <p className="text-base sm:text-lg text-rose-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Non puoi venire fisicamente al CAF? Con il servizio online di <strong>Bossa Rachele</strong> puoi compilare e svolgere qualsiasi pratica (730, ISEE, Pensioni, Assegno Unico, Disoccupazione) in videoconferenza diretta su <strong>Google Meet</strong> o via <strong>WhatsApp</strong>.
            </p>

            {/* Vantaggi Rapidi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-50 bg-red-950/60 border border-red-700/80 p-2.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Videocall Google Meet con Bossa Rachele</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-50 bg-red-950/60 border border-red-700/80 p-2.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zero file e zero fogli da stampare</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-50 bg-red-950/60 border border-red-700/80 p-2.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Prenotazione slot orario disponibile</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-50 bg-red-950/60 border border-red-700/80 p-2.5 rounded-xl shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Notifiche WhatsApp in tempo reale</span>
              </div>
            </div>

            {/* Pulsanti Azione Principali */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onScrollToBooking}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-red-950 font-extrabold px-6 py-3.5 rounded-2xl shadow-xl shadow-red-950/40 hover:shadow-2xl transition transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                <Video className="w-4 h-4 text-red-900" />
                <span>Prenota o Avvia Videochiamata</span>
              </button>

              <button
                onClick={onScrollToServices}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-950/60 hover:bg-red-950 text-white font-bold px-6 py-3.5 rounded-2xl border border-red-600/80 shadow-md transition text-sm"
              >
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Tutti i Servizi & Documenti</span>
              </button>

              {!currentClient && (
                <button
                  onClick={onOpenRegistration}
                  className="w-full sm:w-auto text-xs font-bold text-amber-300 hover:text-white underline py-2"
                >
                  Registrati subito all'app &rarr;
                </button>
              )}
            </div>

          </div>

          {/* Colonna Destra: Card Logo 3D Grande & Interattivo con NOTA BENE */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div 
              className="perspective-container w-full max-w-sm"
              onMouseEnter={() => setIsHovered(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={resetTilt}
            >
              <div 
                className="logo-3d-card bg-gradient-to-br from-white via-rose-50 to-amber-50/70 p-8 rounded-3xl border-2 border-red-300/80 shadow-2xl shadow-red-950/40 relative overflow-hidden"
                style={{
                  transform: isHovered
                    ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.04, 1.04, 1.04)`
                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
                }}
              >
                {/* Glow ring */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-red-400/20 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex flex-col items-center text-center space-y-4">
                  
                  {/* LOGO 3D IN EVIDENZA */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 rounded-3xl p-3 shadow-xl shadow-red-700/40 flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
                    <img 
                      src="/logo.png" 
                      alt="Logo Zero Carta di Bossa Rachele" 
                      className="w-full h-full object-contain rounded-2xl drop-shadow-lg logo-img-3d"
                    />
                    <div className="absolute inset-0 rounded-3xl border-2 border-white/50 pointer-events-none"></div>
                  </div>

                  {/* NOME BRAND 3D */}
                  <div className="space-y-1 logo-text-3d">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                      <span className="bg-gradient-to-r from-red-700 via-rose-700 to-red-900 bg-clip-text text-transparent">
                        Zero Carta
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm font-extrabold tracking-wider text-red-950 uppercase">
                      <span className="text-red-600 font-extrabold lowercase">di</span> Bossa Rachele
                    </p>
                  </div>

                  {/* NOTA BENE SOTTO AL LOGO */}
                  <div className="w-full bg-gradient-to-r from-amber-100 via-amber-50 to-yellow-100 border-2 border-amber-400 p-3 rounded-2xl text-left shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs font-black text-red-950 uppercase tracking-wide">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Nota Bene:</span>
                    </div>
                    <p className="text-xs text-red-900 font-bold mt-1 leading-snug">
                      Per usufruire del servizio di video call con Meet di Google, <strong>bisogna avere una Gmail</strong>.
                    </p>
                  </div>

                  <div className="w-full border-t border-red-200/80 pt-3 mt-1">
                    <div className="flex items-center justify-between text-xs bg-red-50/90 p-3 rounded-xl border border-red-200 shadow-xs">
                      <span className="font-bold text-red-950">Assistenza Live:</span>
                      {settings.isOnline ? (
                        <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                          Operatore ON-LINE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-extrabold text-rose-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                          Operatore OFF-LINE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recapiti Rapidi Card */}
                  <div className="w-full text-left space-y-1.5 text-[11px] text-red-900 bg-amber-50/80 p-3 rounded-xl border border-amber-200/70">
                    <p className="flex items-start justify-between gap-1">
                      <span className="font-semibold text-red-950 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-700 shrink-0 mt-0.5" /> Sede fisica:
                      </span>
                      <strong className="text-red-800 font-bold text-right">Via P. Mattarella 30, Afragola</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="font-semibold text-red-950">WhatsApp / Tel:</span>
                      <strong className="text-red-800 font-bold">{settings.whatsappNumber}</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="font-semibold text-red-950">Google Meet:</span>
                      <strong className="text-red-800 font-bold truncate max-w-[170px]">{settings.meetEmail}</strong>
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Box NOTA BENE in evidenza sotto al logo */}
            <div className="mt-3.5 w-full max-w-sm bg-red-950/90 border-2 border-amber-400/90 p-3 rounded-2xl text-center shadow-xl">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Nota Bene</span>
              </span>
              <p className="text-xs text-rose-100 font-bold mt-0.5 leading-snug">
                Per usufruire del servizio di video call con Meet di Google, <strong>bisogna avere una Gmail</strong>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
