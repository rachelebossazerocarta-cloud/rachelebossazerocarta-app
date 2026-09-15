import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  MessageCircle, 
  Video, 
  ShieldCheck, 
  Lock, 
  User, 
  LogOut, 
  Circle,
  Clock
} from 'lucide-react';

export default function Header({ onOpenRegistration, onOpenPinModal }) {
  const { 
    settings, 
    currentClient, 
    logoutClient, 
    viewMode, 
    setViewMode,
    getSessionRemainingMinutes
  } = useApp();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setMousePos({ x, y });
  };

  const resetMouse = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <header className="sticky top-0 z-40 bg-red-900/95 backdrop-blur-md border-b border-red-700/70 shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          
          {/* BRANDING CON LOGO 3D */}
          <div className="flex items-center gap-4">
            <div 
              className="perspective-container cursor-pointer select-none"
              onMouseEnter={() => setIsHovered(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={resetMouse}
              onClick={() => setViewMode('client')}
              title="Zero Carta di Bossa Rachele"
            >
              <div 
                className="logo-3d-card flex items-center gap-3.5 bg-gradient-to-br from-white via-rose-50/90 to-amber-50/80 p-2.5 sm:p-3 rounded-2xl border-2 border-red-200/90 shadow-xl shadow-red-950/20 transition-transform duration-200 ease-out"
                style={{
                  transform: isHovered 
                    ? `perspective(1000px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg) scale3d(1.03, 1.03, 1.03)` 
                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
                }}
              >
                {/* Logo Image with 3D Depth */}
                <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 p-1.5 shadow-md shadow-red-700/30">
                  <div className="absolute inset-0 bg-white/20 rounded-xl blur-xs"></div>
                  <img 
                    src="/logo.png" 
                    alt="Logo Zero Carta" 
                    className="w-full h-full object-contain rounded-lg drop-shadow-md logo-img-3d"
                  />
                  {/* 3D shine ring */}
                  <div className="absolute -inset-0.5 rounded-xl border border-white/50 pointer-events-none"></div>
                </div>

                {/* Typography: Zero Carta in 3D effect + di Bossa Rachele in piccolo */}
                <div className="flex flex-col text-left logo-text-3d">
                  <span className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                    <span className="bg-gradient-to-r from-red-700 via-rose-700 to-red-900 bg-clip-text text-transparent drop-shadow-xs">
                      Zero Carta
                    </span>
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-red-950 uppercase flex items-center gap-1.5">
                    <span className="text-red-600 font-bold">di</span> Bossa Rachele
                    <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    <span className="hidden sm:inline-block text-[10px] text-red-700 font-medium lowercase">patronato & caf</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STATO OPERATORE ONLINE / OFFLINE (Sincronizzato in tempo reale) */}
          <div className="hidden lg:flex items-center">
            {settings.isOnline ? (
              <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-bold shadow-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Operatore ON-LINE (Videochiamate attive)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500 text-rose-200 text-xs font-bold shadow-md">
                <span className="inline-flex rounded-full h-2.5 w-2.5 bg-rose-400"></span>
                <span>Operatore OFF-LINE (Prenotazioni aperte)</span>
              </div>
            )}
          </div>

          {/* CONTROLLI DESTRA: CLIENTE / GESTORE PIN */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Sezione Profilo Cliente */}
            {currentClient ? (
              <div className="flex items-center gap-2 bg-red-950/70 hover:bg-red-950 border border-red-700 px-3 py-1.5 rounded-xl transition text-white">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-red-950 flex items-center justify-center font-extrabold text-xs shadow-xs">
                  {currentClient.nome?.[0] || 'C'}{currentClient.cognome?.[0] || ''}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-white leading-tight">
                    {currentClient.nome} {currentClient.cognome}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold" title="La registrazione dura 120 minuti, dopodiché il sistema scollega tutto per sicurezza">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Sessione: {getSessionRemainingMinutes()} min</span>
                  </div>
                </div>
                <button
                  onClick={logoutClient}
                  title="Disconnetti cliente"
                  className="p-1 text-rose-300 hover:text-white rounded-md transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenRegistration}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-red-950 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-900/30 hover:shadow-xl transition transform active:scale-95"
              >
                <User className="w-4 h-4 text-red-900" />
                <span>Registrati / Accedi</span>
              </button>
            )}

            {/* Pulsante Switch Modalità: Gestore App (PIN) o Ritorna al Cliente */}
            {viewMode === 'admin' ? (
              <button
                onClick={() => setViewMode('client')}
                className="flex items-center gap-1.5 bg-red-950 hover:bg-red-900 text-white px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border border-red-700 shadow transition"
              >
                <span>Vista Cliente</span>
              </button>
            ) : (
              <button
                onClick={onOpenPinModal}
                className="flex items-center gap-1.5 bg-red-950 hover:bg-red-900 text-amber-300 hover:text-white px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border border-amber-500/40 shadow-sm hover:border-amber-400 transition active:scale-95"
                title="Accesso Gestore CAF"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Pannello Gestore</span>
                <span className="sm:hidden">Gestore</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
