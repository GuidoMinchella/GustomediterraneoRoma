import React from 'react';

const CookiesPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-800 mb-4">Cookies Policy</h1>
      <p className="text-sm text-zinc-700 mb-3">
        In questa pagina troverai informazioni dettagliate sui cookie utilizzati su questo sito e sulle finalità del trattamento dei dati.
      </p>
      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Cosa sono i cookie?</h2>
      <p className="text-sm text-zinc-700 mb-3">
        I cookie sono piccoli file di testo che i siti web possono utilizzare per rendere più efficiente l'esperienza dell'utente.
        La legge afferma che possiamo memorizzare cookie sul tuo dispositivo se sono strettamente necessari per il funzionamento di questo sito.
        Per tutti gli altri tipi di cookie abbiamo bisogno della tua autorizzazione.
      </p>
      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Tipologie di cookie</h2>
      <ul className="list-disc pl-6 text-sm text-zinc-700 space-y-2">
        <li><span className="font-medium">Funzionali:</span> sempre attivi, necessari per funzioni di base e sicurezza.</li>
        <li><span className="font-medium">Preferences:</span> memorizzano le preferenze dell'utente.</li>
        <li><span className="font-medium">Statistiche:</span> raccolgono dati in forma aggregata per finalità statistiche.</li>
        <li><span className="font-medium">Marketing:</span> utilizzati per creare profili utente e inviare pubblicità personalizzata.</li>
      </ul>
      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Gestione del consenso</h2>
      <p className="text-sm text-zinc-700 mb-3">
        Puoi modificare le tue preferenze sui cookie in qualsiasi momento tramite il pannello di gestione del consenso.
        Il consenso viene memorizzato nel tuo browser e potrà essere revocato accedendo nuovamente al pannello.
      </p>
      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Dettagli legali</h2>
      <p className="text-sm text-zinc-700 mb-3">
        Per ulteriori dettagli legali sul trattamento dei dati personali, consulta la nostra Informativa sulla Privacy.
      </p>
    </div>
  );
};

export default CookiesPolicy;
