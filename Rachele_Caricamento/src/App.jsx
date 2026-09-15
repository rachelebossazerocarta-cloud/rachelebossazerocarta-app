import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import BookingSection from './components/BookingSection';
import AdminPanel from './components/AdminPanel';
import QuickContactBar from './components/QuickContactBar';
import Footer from './components/Footer';
import ClientRegistrationModal from './components/ClientRegistrationModal';
import { Clock, X } from 'lucide-react';

function MainLayout() {
  const { viewMode, setViewMode, sessionExpiredAlert, setSessionExpiredAlert } = useApp();
  
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceForBooking = (service) => {
    setSelectedServiceForBooking(service);
    scrollToSection('prenotazioni');
  };

  const handleOpenRegistration = (actionCallback = null) => {
    if (typeof actionCallback === 'function') {
      setPendingAction(() => actionCallback);
    } else {
      setPendingAction(null);
    }
    setIsRegistrationOpen(true);
  };

  const handleRegistrationSuccess = (savedClient) => {
    if (pendingAction) {
      pendingAction(savedClient);
      setPendingAction(null);
    }
  };

  // Se siamo in modalità Gestore Admin
  if (viewMode === 'admin') {
    return (
      <AdminPanel onClose={() => setViewMode('client')} />
    );
  }

  // Vista Cliente
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-800 via-red-900 to-rose-950 text-white relative">
      
      {/* Intestazione con Logo 3D e Controlli */}
      <Header 
        onOpenRegistration={() => handleOpenRegistration()}
        onOpenPinModal={() => setViewMode('admin')}
      />

      {/* Avviso Notifica di avvenuta disconnessione dopo 120 minuti */}
      {sessionExpiredAlert && (
        <aside aria-label="Sessione Scaduta" className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 animate-bounce">
          <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-red-950 p-4 rounded-2xl shadow-2xl border-2 border-amber-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-950 text-amber-300 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <h4 className="text-sm font-black text-red-950">Sessione di 120 Minuti Scaduta</h4>
                <p className="text-red-900 font-semibold mt-0.5 leading-snug">
                  Il sistema ha scollegato l'accesso per motivi di sicurezza. Per contattare su WhatsApp, telefonare o richiedere videochiamate, registrati nuovamente con i tuoi dati.
                </p>
                <button
                  onClick={() => {
                    setSessionExpiredAlert(false);
                    handleOpenRegistration();
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-950 text-white text-xs font-bold hover:bg-red-900 transition cursor-pointer"
                >
                  <span>Registrati di nuovo</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => setSessionExpiredAlert(false)}
              className="p-1.5 rounded-lg text-red-900 hover:bg-amber-500/30 transition cursor-pointer"
              aria-label="Chiudi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      <main className="flex-1">
        {/* Presentazione Principale Hero */}
        <HeroSection 
          onOpenRegistration={handleOpenRegistration}
          onScrollToServices={() => scrollToSection('servizi-caf')}
          onScrollToBooking={() => scrollToSection('prenotazioni')}
        />

        {/* Catalogo Completo Servizi CAF & Patronato */}
        <ServicesSection 
          onSelectServiceForBooking={handleSelectServiceForBooking}
          onOpenRegistration={handleOpenRegistration}
        />

        {/* Sistema di Prenotazione Orari e Videochiamate Google Meet */}
        <BookingSection 
          selectedService={selectedServiceForBooking}
          onOpenRegistration={() => handleOpenRegistration()}
        />
      </main>

      {/* Barra Inferiore Fissa Contatti Rapidi WhatsApp & Telefono */}
      <QuickContactBar 
        onScrollToBooking={() => scrollToSection('prenotazioni')}
        onOpenRegistration={handleOpenRegistration}
      />

      {/* Piè di Pagina */}
      <Footer 
        onOpenPinModal={() => setViewMode('admin')}
        onOpenRegistration={handleOpenRegistration}
      />

      {/* Modale Registrazione / Accesso Cliente */}
      <ClientRegistrationModal 
        isOpen={isRegistrationOpen}
        onClose={() => {
          setIsRegistrationOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleRegistrationSuccess}
      />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
