export const CAF_CATEGORIES = [
  { id: 'all', label: 'Tutti i Servizi', icon: 'Sparkles' },
  { id: 'fisco', label: 'Fisco & 730', icon: 'ReceiptText' },
  { id: 'isee', label: 'ISEE & Bonus', icon: 'BadgePercent' },
  { id: 'pensioni', label: 'Pensioni & Previdenza', icon: 'Landmark' },
  { id: 'sostegno', label: 'Disoccupazione & Sostegno', icon: 'HandHeart' },
  { id: 'famiglia', label: 'Famiglia & Figli', icon: 'Users' },
  { id: 'invalidita', label: 'Invalidità & Legge 104', icon: 'HeartPulse' },
  { id: 'lavoro', label: 'Colf, Badanti & Dimissioni', icon: 'Briefcase' },
  { id: 'immigrazione', label: 'Immigrazione & Permessi', icon: 'Globe' },
  { id: 'casa', label: 'Locazioni & Successioni', icon: 'Home' }
];

export const CAF_SERVICES = [
  {
    id: 'modello-730',
    category: 'fisco',
    badge: 'Più Richiesto',
    title: 'Modello 730 & Dichiarazione Redditi',
    summary: 'Dichiarazione dei redditi per lavoratori dipendenti e pensionati con rimborso diretto in busta paga o pensione.',
    description: 'Il Modello 730 è lo strumento principale per dichiarare i redditi e recuperare le spese sostenute nell’anno precedente: spese sanitarie, scontrini farmacia, mutui prima casa, assicurazioni, spese scolastiche, ristrutturazioni ed ecobonus.',
    documents: [
      'Documento d\'identità e Codice Fiscale del dichiarante e familiari',
      'Certificazione Unica (CU) di tutti i datori di lavoro o INPS',
      'Ricevute spese mediche, visite specialistiche e scontrini farmacia',
      'Interessi passivi mutuo acquisto prima casa e rogito notarile',
      'Spese veterinarie, universitarie, asilo nido o attività sportive figli',
      'Bonifici parlanti e fatture per ristrutturazioni edili o risparmio energetico'
    ]
  },
  {
    id: 'modello-redditi-pf',
    category: 'fisco',
    badge: 'Fiscale',
    title: 'Modello Redditi Persone Fisiche (Ex Unico)',
    summary: 'Per contribuenti con partita IVA forfettaria/ordinaria, redditi esteri o plusvalenze finanziarie.',
    description: 'Dedicato a liberi professionisti, commercianti, artigiani o contribuenti che possiedono tipologie di reddito che non possono essere dichiarate con il 730.',
    documents: [
      'Documento d\'identità e Codice Fiscale',
      'Fatture emesse e corrispettivi registrati nell\'anno',
      'Fatture fornitori e spese inerenti l\'attività',
      'Attestazioni versamenti F24 imposte e contributi previdenziali versati',
      'Quadro RW in caso di investimenti o conti correnti esteri'
    ]
  },
  {
    id: 'calcolo-imu-tasi',
    category: 'fisco',
    badge: 'Scadenza Giugno/Dicembre',
    title: 'Calcolo IMU & Ravvedimento Operoso',
    summary: 'Calcolo esatto dell\'imposta municipale propria per seconde case, terreni ed immobili strumentali.',
    description: 'Predisposizione conteggio di acconto e saldo IMU, verifica delle aliquote deliberate dal Comune di ubicazione degli immobili e generazione dei modelli F24 per il pagamento bancario o postale.',
    documents: [
      'Visura catastale aggiornata degli immobili posseduti',
      'Percentuale e mesi di possesso per ogni immobile',
      'Eventuali contratti di locazione registrati a canone concordato',
      'Attestazione di comodato d\'uso registrato (se applicabile)'
    ]
  },
  {
    id: 'isee-ordinario-corrente',
    category: 'isee',
    badge: 'Fondamentale',
    title: 'Attestazione ISEE Ordinario e ISEE Corrente',
    summary: 'Indicatore della situazione economica per accedere a bonus comunali, statali e sconti tasse universitarie.',
    description: 'La Dichiarazione Sostitutiva Unica (DSU) fotografa la situazione reddituale e patrimoniale del nucleo familiare. In caso di calo del reddito o perdita di lavoro, elaboriamo anche l\'ISEE Corrente per aggiornare tempestivamente il valore.',
    documents: [
      'Codice Fiscale e documento di tutti i componenti del nucleo familiare',
      'Certificazione Unica o 730/Redditi di due anni precedenti',
      'Saldo e Giacenza Media al 31/12 di tutti i conti correnti, carte prepagate e libretti postali',
      'Valore del patrimonio mobiliare (azioni, obbligazioni, fondi, polizze vita)',
      'Contratto di locazione registrato e canone annuo (se casa in affitto)',
      'Targa di autoveicoli e motoveicoli di cilindrata pari o superiore a 500cc'
    ]
  },
  {
    id: 'isee-universitario-minorenni',
    category: 'isee',
    badge: 'Agevolazioni',
    title: 'ISEE Minorenni & ISEE Universitario',
    summary: 'Dedicato a studenti per esonero tasse universitarie/borse di studio, e genitori non conviventi/non sposati.',
    description: 'Modulo speciale necessario sia per l\'iscrizione ad atenei universitari sia per genitori con figli minorenni qualora uno dei due genitori non sia residente o coniugato con l\'altro.',
    documents: [
      'Documenti ordinari ISEE dell\'intero nucleo familiare',
      'Codice Fiscale dello studente universitario e ateneo di frequenza',
      'Dati anagrafici e reddituali del genitore non convivente (se ISEE Minorenni)'
    ]
  },
  {
    id: 'bonus-sociali-carta-dedicata',
    category: 'isee',
    badge: 'Bonus Sociali',
    title: 'Bonus Sociali (Luce, Gas, Acqua) & Carta Dedicata a Te',
    summary: 'Verifica requisiti e assistenza per l\'accesso alle agevolazioni sulle utenze domestiche e carta spesa.',
    description: 'Supporto pratico per accertare il rispetto delle soglie ISEE per lo sconto automatico in bolletta e per il monitoraggio della graduatoria INPS per la carta spesa alimentare.',
    documents: [
      'Attestazione ISEE in corso di validità',
      'Bolletta recente fornitura energia elettrica (Codice POD)',
      'Bolletta recente fornitura gas naturale (Codice PDR)',
      'Bolletta servizio idrico integrato'
    ]
  },
  {
    id: 'assegno-unico-universale',
    category: 'famiglia',
    badge: 'Per Famiglie',
    title: 'Assegno Unico e Universale (AUU)',
    summary: 'Sostegno economico mensile per ogni figlio a carico dal 7° mese di gravidanza fino a 21 anni.',
    description: 'Gestione della domanda telematica INPS, inserimento maggiorazioni per figli disabili, madri under 21, famiglie numerose e genitori entrambi lavoratori.',
    documents: [
      'Codici Fiscali dei genitori e di tutti i figli a carico',
      'Attestazione ISEE in corso di validità (per importo massimo spettante)',
      'Codice IBAN intestato o cointestato al genitore richiedente',
      'Verbale Legge 104 o invalidità del figlio (ove presente per maggiorazioni)'
    ]
  },
  {
    id: 'bonus-asilo-nido',
    category: 'famiglia',
    badge: 'Rimborsi',
    title: 'Bonus Asilo Nido & Supporto Domiciliare',
    summary: 'Contributo economico fino a 3.600€ annui per il pagamento delle rette di nidi pubblici e privati autorizzati.',
    description: 'Invio della domanda annuale all\'INPS e rendicontazione periodica di tutte le fatture e ricevute mensili pagate per ottenere il rimborso sul proprio conto corrente.',
    documents: [
      'Codice Fiscale di minore e genitore pagante',
      'Attestazione ISEE minorenni valido',
      'Provvedimento di iscrizione al nido o denominazione struttura',
      'Fatture o ricevute di pagamento recanti codice fiscale genitore e minore',
      'IBAN del genitore richiedente'
    ]
  },
  {
    id: 'naspi-disoccupazione',
    category: 'sostegno',
    badge: 'Tempestivo',
    title: 'NASpI & Disoccupazione Dipendenti',
    summary: 'Indennità mensile di disoccupazione per lavoratori dipendenti che hanno perso involontariamente il lavoro.',
    description: 'La domanda deve essere presentata entro e non oltre 68 giorni dalla cessazione del rapporto di lavoro. Monitoriamo l’istruttoria INPS, il calcolo della prestazione e la decorrenza dell’erogazione.',
    documents: [
      'Documento d\'identità e Codice Fiscale del richiedente',
      'Ultima busta paga e lettera di licenziamento o fine contratto a termine',
      'Eventuale modello SR163/Attestazione bancaria IBAN timbrata dalla banca',
      'Storico contributivo o precedenti contratti di lavoro'
    ]
  },
  {
    id: 'disoccupazione-agricola',
    category: 'sostegno',
    badge: 'Scadenza 31 Marzo',
    title: 'Disoccupazione Agricola',
    summary: 'Prestazione economica a favore degli operai agricoli a tempo determinato e indeterminato.',
    description: 'Compilazione ed invio telematico della domanda di disoccupazione per i lavoratori agricoli iscritti negli elenchi nominativi dei lavoratori agricoli.',
    documents: [
      'Documento d\'identità e Codice Fiscale',
      'Buste paga relative all\'anno solare di riferimento',
      'Coordinate bancarie IBAN per l\'accredito della prestazione'
    ]
  },
  {
    id: 'adi-sfl-inclusione',
    category: 'sostegno',
    badge: 'Nuove Norme',
    title: 'Assegno di Inclusione (ADI) & SFL',
    summary: 'Misure di contrasto alla povertà e sostegno all\'inclusione sociale e lavorativa che sostituiscono il RdC.',
    description: 'Verifica approfondita dei requisiti di scala di equivalenza (presenza di minori, over 60, persone con disabilità o soggetti presi in carico dai servizi sociali) e invio telematico istanza INPS.',
    documents: [
      'Documento d\'identità e Codice Fiscale di tutti i componenti',
      'Attestazione ISEE in corso di validità',
      'Certificazione di svantaggio o presa in carico sociale (se applicabile)',
      'Contratto di locazione registrato con relativi estremi'
    ]
  },
  {
    id: 'pensioni-vecchiaia-anticipata',
    category: 'pensioni',
    badge: 'Patronato',
    title: 'Pensione di Vecchiaia, Anticipata & Quota 103',
    summary: 'Calcolo decorrenza, verifica diritto, calcolo presunto e invio della domanda di pensione INPS.',
    description: 'Consulenza previdenziale completa con analisi dell\'estratto conto contributivo ECOCERT, simulazione della decorrenza per Pensione di Vecchiaia (67 anni e 20 anni di contributi), Anticipata ordinaria, Opzione Donna, e Quota 103.',
    documents: [
      'Documento d\'identità e Codice Fiscale',
      'Estratto conto contributivo INPS completo',
      'Stato civile e dati anagrafici del coniuge',
      'Codice IBAN per l\'accredito della pensione'
    ]
  },
  {
    id: 'pensione-reversibilita',
    category: 'pensioni',
    badge: 'Patronato Urgente',
    title: 'Pensione ai Superstiti (Reversibilità)',
    summary: 'Domanda di pensione spettante al coniuge superstite e ai figli superstiti in caso di decesso del titolare di pensione.',
    description: 'Gestione rapida della pratica di reversibilità con liquidazione dei ratei maturati e non riscossi, calcolo delle percentuali spettanti e verifica del cumulo con altri redditi.',
    documents: [
      'Certificato di morte del coniuge/dante causa',
      'Documento e Codice Fiscale del coniuge superstite e figli',
      'Dichiarazione dei redditi del coniuge superstite',
      'IBAN del richiedente'
    ]
  },
  {
    id: 'invalidita-civile-legge-104',
    category: 'invalidita',
    badge: 'Diritti & Tutele',
    title: 'Invalidità Civile, Legge 104 & Accompagnamento',
    summary: 'Riconoscimento percentuale di invalidità, handicap grave (art. 3 comma 3) e indennità di accompagnamento.',
    description: 'Dopo l’invio del certificato medico telematico da parte del medico curante, inoltriamo all\'INPS la domanda amministrativa per la visita medico-legale presso la commissione ASL/INPS.',
    documents: [
      'Codice identificativo del certificato medico telematico rilasciato dal curante',
      'Documento d\'identità e Tessera Sanitaria in corso di validità',
      'Tutta la documentazione clinica recente, referti ospedalieri e relazioni specialistiche',
      'IBAN personale per liquidazione eventuali indennità'
    ]
  },
  {
    id: 'contratti-colf-badanti',
    category: 'lavoro',
    badge: 'Gestione Lavoro',
    title: 'Gestione Lavoro Domestico (Colf & Badanti)',
    summary: 'Lettera di assunzione, contrattualistica CCNL lavoro domestico, buste paga mensili e calcolo contributi trimestrali INPS.',
    description: 'Supporto a 360 gradi per le famiglie che assumono colf, badanti o baby-sitter: redazione contratto, comunicazione telematica INPS obbligatoria entro le 24 ore precedenti l\'inizio, emissione cedolini e bollettini PagoPA.',
    documents: [
      'Documento e Codice Fiscale del datore di lavoro e del lavoratore domestico',
      'Permesso di soggiorno in corso di validità (per lavoratori extracomunitari)',
      'Dettagli su orario settimanale, mansioni, vitto/alloggio e retribuzione concordata'
    ]
  },
  {
    id: 'dimissioni-telematiche',
    category: 'lavoro',
    badge: 'Obbligo Telematico',
    title: 'Dimissioni Telematiche Volontarie',
    summary: 'Procedura online obbligatoria per legge per rassegnare le dimissioni dal proprio posto di lavoro dipendente.',
    description: 'Invio telematico immediato al Ministero del Lavoro e delle Politiche Sociali delle dimissioni volontarie o risoluzione consensuale con rilascio della ricevuta ufficiale con marca temporale.',
    documents: [
      'Documento d\'identità e Codice Fiscale',
      'Ultima busta paga (con dati esatti del datore di lavoro: P.IVA/CF e PEC aziendale)',
      'Data esatta di inizio del preavviso o dell\'ultimo giorno di lavoro effettivo'
    ]
  },
  {
    id: 'permessi-soggiorno-cittadinanza',
    category: 'immigrazione',
    badge: 'Immigrazione',
    title: 'Permessi di Soggiorno & Cittadinanza',
    summary: 'Compilazione kit postale rinnovo permesso, carta di soggiorno UE e domanda telematica di cittadinanza.',
    description: 'Assistenza completa per cittadini stranieri: rinnovo per motivi di lavoro subordinato, autonomo, famiglia, studio; richiesta di permesso per soggiornanti di lungo periodo (ex carta di soggiorno) e istanza di cittadinanza per residenza o matrimonio al Ministero dell\'Interno.',
    documents: [
      'Passaporto in corso di validità e permesso di soggiorno attuale',
      'Codice Fiscale e Carta d\'Identità italiana',
      'Certificazione Unica (CU) o Modello Redditi degli ultimi anni',
      'Contratto di lavoro e ultime 3 buste paga',
      'Certificato di idoneità alloggiativa e cessione di fabbricato (se necessario)',
      'Certificato del Casellario Giudiziale e certificato di nascita tradotto e legalizzato (per Cittadinanza)'
    ]
  },
  {
    id: 'locazioni-contratti-affitto',
    category: 'casa',
    badge: 'Patrimonio Casa',
    title: 'Contratti di Locazione & Affitti',
    summary: 'Stesura, calcolo canone concordato, registrazione telematica Agenzia delle Entrate e proroghe/risoluzioni.',
    description: 'Elaborazione contratti a canone libero (4+4), transitori, per studenti o a canone concordato (3+2 con agevolazione cedolare secca al 10% e sconto IMU). Invio telematico modello RLI e pagamento imposte di registro.',
    documents: [
      'Documenti d\'identità e Codici Fiscali di proprietario e inquilino',
      'Visura catastale e planimetria dell\'immobile e pertinenze (box/cantina)',
      'Attestato di Prestazione Energetica (APE) in corso di validità',
      'Dati su canone pattuito, decorrenza e opzione per cedolare secca'
    ]
  },
  {
    id: 'successioni-ereditarie',
    category: 'casa',
    badge: 'Consulenza Speciale',
    title: 'Dichiarazioni di Successione & Volture Catastali',
    summary: 'Pratiche di successione ereditaria telematica presso l\'Agenzia delle Entrate e aggiornamento volture al Catasto.',
    description: 'Dalla ricostruzione dell\'asse ereditario al conteggio delle imposte ipotecarie e catastali, predisposizione della dichiarazione telematica e successivo aggiornamento catastale degli intestatari degli immobili.',
    documents: [
      'Certificato di morte in carta libera e stato di famiglia del defunto',
      'Documenti e Codici Fiscali di tutti gli eredi',
      'Visure catastali di tutti gli immobili di proprietà del defunto',
      'Certificazione bancaria o postale della consistenza patrimoniale al momento del decesso',
      'Eventuale verbale di pubblicazione del testamento o rinuncia all\'eredità'
    ]
  }
];
