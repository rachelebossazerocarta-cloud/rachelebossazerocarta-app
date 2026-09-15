import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Phone, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ClientRegistrationModal({ isOpen, onClose, onSuccess, initialData = null }) {
  const { registerClient, currentClient } = useApp();

  const [formData, setFormData] = useState({
    nome: initialData?.nome || currentClient?.nome || '',
    cognome: initialData?.cognome || currentClient?.cognome || '',
    cellulare: initialData?.cellulare || currentClient?.cellulare || '',
    email: initialData?.email || currentClient?.email || '',
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.nome.trim()) errs.nome = 'Il nome è obbligatorio';
    if (!formData.cognome.trim()) errs.cognome = 'Il cognome è obbligatorio';
    
    const cleanPhone = formData.cellulare.replace(/\s+/g, '');
    if (!cleanPhone) {
      errs.cellulare = 'Il numero di cellulare è obbligatorio';
    } else if (cleanPhone.length < 9) {
      errs.cellulare = 'Inserisci un numero di cellulare valido';
    }

    if (!formData.email.trim()) {
      errs.email = 'L\'indirizzo email è obbligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Inserisci un indirizzo email valido';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const saved = registerClient({
      nome: formData.nome.trim(),
      cognome: formData.cognome.trim(),
      cellulare: formData.cellulare.trim(),
      email: formData.email.trim(),
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      if (onSuccess) {
        onSuccess(saved);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md animate-fade-in text-slate-800">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-red-200 overflow-hidden transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner superiore con gradiente Rosso Rubino */}
        <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                {currentClient ? 'Aggiorna i tuoi Dati' : 'Benvenuto su Zero Carta'}
              </h2>
              <p className="text-rose-100 text-xs mt-0.5 font-medium">
                Patronato e CAF di Bossa Rachele • Accesso Pratiche & Videochiamate
              </p>
            </div>
          </div>
        </div>

        {/* Corpo Modale */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-red-950">
                Registrazione Completata con Successo!
              </h3>
              <p className="text-sm text-slate-600">
                I tuoi dati sono stati registrati nella rubrica dell'app. Ora puoi prenotare o avviare videochiamate.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-900 mb-2">
                <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Registrazione richiesta:</strong> inserisci i tuoi recapiti prima di contattare su <strong>WhatsApp</strong>, chiamare al telefono o prenotare una <strong>videochiamata</strong>. La sessione rimane attiva per <strong>120 minuti</strong>, dopodiché il sistema scollegherà tutto automaticamente e richiederà un nuovo inserimento.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-bold text-red-950 uppercase tracking-wider mb-1.5">
                    Nome *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Es. Mario"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm focus:outline-none focus:ring-2 transition ${
                        errors.nome 
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30' 
                          : 'border-red-200 focus:border-red-600 focus:ring-red-100 bg-red-50/30 font-semibold text-slate-800'
                      }`}
                    />
                  </div>
                  {errors.nome && <p className="text-[11px] text-rose-600 mt-1 font-bold">{errors.nome}</p>}
                </div>

                {/* Cognome */}
                <div>
                  <label className="block text-xs font-bold text-red-950 uppercase tracking-wider mb-1.5">
                    Cognome *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Es. Rossi"
                      value={formData.cognome}
                      onChange={(e) => setFormData({ ...formData, cognome: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm focus:outline-none focus:ring-2 transition ${
                        errors.cognome 
                          ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30' 
                          : 'border-red-200 focus:border-red-600 focus:ring-red-100 bg-red-50/30 font-semibold text-slate-800'
                      }`}
                    />
                  </div>
                  {errors.cognome && <p className="text-[11px] text-rose-600 mt-1 font-bold">{errors.cognome}</p>}
                </div>
              </div>

              {/* Cellulare */}
              <div>
                <label className="block text-xs font-bold text-red-950 uppercase tracking-wider mb-1.5">
                  Numero di Cellulare (WhatsApp) *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-extrabold text-red-700 select-none">
                    +39
                  </span>
                  <input
                    type="tel"
                    placeholder="338 123 4567"
                    value={formData.cellulare}
                    onChange={(e) => setFormData({ ...formData, cellulare: e.target.value })}
                    className={`w-full pl-12 pr-4 py-2.5 rounded-xl border-2 text-sm focus:outline-none focus:ring-2 transition ${
                      errors.cellulare 
                        ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30' 
                        : 'border-red-200 focus:border-red-600 focus:ring-red-100 bg-red-50/30 font-semibold text-slate-800'
                    }`}
                  />
                  <Phone className="absolute right-3.5 w-4 h-4 text-red-400" />
                </div>
                {errors.cellulare && <p className="text-[11px] text-rose-600 mt-1 font-bold">{errors.cellulare}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-red-950 uppercase tracking-wider mb-1.5">
                  Indirizzo Email *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="nome.cognome@esempio.it"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm focus:outline-none focus:ring-2 transition ${
                      errors.email 
                        ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30' 
                        : 'border-red-200 focus:border-red-600 focus:ring-red-100 bg-red-50/30 font-semibold text-slate-800'
                    }`}
                  />
                  <Mail className="absolute right-3.5 w-4 h-4 text-red-400" />
                </div>
                {errors.email && <p className="text-[11px] text-rose-600 mt-1 font-bold">{errors.email}</p>}
                <p className="text-[11px] text-amber-900 bg-amber-50 border border-amber-300 p-2 rounded-lg mt-1.5 font-medium">
                  <strong>Nota bene:</strong> per usufruire del servizio di video call con Meet di Google, <strong>bisogna avere una Gmail</strong>.
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-red-950 font-black py-3.5 px-6 rounded-xl shadow-lg shadow-amber-950/20 transition transform active:scale-98"
                >
                  {currentClient ? 'Aggiorna Dati' : 'Salva Dati ed Entra nell\'App'}
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400 mt-2">
                I tuoi dati sono protetti e utilizzati esclusivamente per le pratiche richieste al Patronato Zero Carta.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
