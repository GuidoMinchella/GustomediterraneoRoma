import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-800 mb-4">Informativa sulla Privacy</h1>
      <p className="text-sm text-zinc-700 mb-3">
        La presente informativa descrive le modalità con cui questo sito raccoglie, utilizza e protegge i dati personali degli utenti, in conformità al Regolamento (UE) 2016/679 ("GDPR") e alla normativa nazionale applicabile.
      </p>

      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Titolare del trattamento</h2>
      <ul className="list-disc pl-6 text-sm text-zinc-700 space-y-1">
        <li><span className="font-medium">Gusto Mediterraneo - Fish Take Away</span></li>
        <li>Indirizzo: Viale Anicio Gallo, 49, 00174 Roma RM</li>
        <li>Telefono: +39 331 332 0411</li>
        <li>Email: info@gustomediterraneo.it</li>
      </ul>

      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Categorie di dati trattati</h2>
      <ul className="list-disc pl-6 text-sm text-zinc-700 space-y-2">
        <li><span className="font-medium">Dati identificativi e di contatto:</span> nome, email, telefono, eventuali informazioni fornite volontariamente.</li>
        <li><span className="font-medium">Dati relativi agli ordini:</span> dettagli dei piatti, importi, orari di ritiro, note fornite dal cliente.</li>
        <li><span className="font-medium">Dati di pagamento:</span> gestiti tramite Stripe; le informazioni di carta non vengono memorizzate nei nostri sistemi.</li>
        <li><span className="font-medium">Dati di autenticazione/account:</span> e-mail e metadati connessi all'account (es. provider OAuth), gestiti tramite Supabase.</li>
        <li><span className="font-medium">Dati di navigazione e cookie:</span> indirizzi IP, log tecnici, preferenze sui cookie, come descritto nella nostra <a href="/cookies-policy" className="underline underline-offset-2">Cookies Policy</a>.</li>
      </ul>

      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Finalità del trattamento e basi giuridiche</h2>
      <ul className="list-disc pl-6 text-sm text-zinc-700 space-y-2">
        <li><span className="font-medium">Esecuzione del contratto (art. 6.1.b GDPR):</span> gestione ordini, pagamento, ritiro, assistenza clienti.</li>
        <li><span className="font-medium">Obblighi legali (art. 6.1.c GDPR):</span> adempimenti fiscali e contabili connessi agli ordini.</li>
        <li><span className="font-medium">Consenso (art. 6.1.a GDPR):</span> invio comunicazioni promozionali/newsletter e uso di cookie non essenziali (preferences/statistiche/marketing).</li>
        <li><span className="font-medium">Legittimo interesse (art. 6.1.f GDPR):</span> sicurezza del sito, prevenzione frodi, miglioramento del servizio.</li>
      </ul>

      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Modalità del trattamento</h2>
      <p className="text-sm text-zinc-700 mb-3">
        Il trattamento avviene tramite strumenti elettronici e misure di sicurezza adeguate a proteggere i dati da accessi non autorizzati, perdita e divulgazione.
      </p>

      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Conservazione dei dati</h2>
      <ul className="list-disc pl-6 text-sm text-zinc-700 space-y-2">
        <li><span className="font-medium">Account utente:</span> fino alla richiesta di cancellazione o chiusura dell'account.</li>
        <li><span className="font-medium">Dati degli ordini:</span> per il tempo necessario a obblighi fiscali/contabili e per tutela legale (tipicamente fino a 10 anni in Italia).</li>
        <li><span className="font-medium">Comunicazioni/contatti:</span> fino a 12 mesi dalla chiusura della richiesta, salvo ulteriori necessità.</li>
        <li><span className="font-medium">Newsletter:</span> fino alla revoca del consenso o cancellazione dall'elenco.</li>
        <li><span className="font-medium">Cookie:</span> come indicato nella <a href="/cookies-policy" className="underline underline-offset-2">Cookies Policy</a>.</li>
      </ul>

      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Destinatari e trasferimenti</h2>
      <ul className="list-disc pl-6 text-sm text-zinc-700 space-y-2">
        <li><span className="font-medium">Fornitori di servizi:</span> 
          <span className="font-medium">Stripe</span> (pagamenti online) e <span className="font-medium">Supabase</span> (autenticazione e database). I dati possono essere trasferiti fuori dallo Spazio Economico Europeo; in tali casi, i fornitori applicano garanzie adeguate (es. Standard Contractual Clauses).
        </li>
        <li><span className="font-medium">Piattaforme esterne di consegna:</span> link a JustEat, Glovo e Deliveroo sono presenti nel sito; qualora l'utente utilizzi tali piattaforme, il trattamento dei dati è effettuato dai rispettivi titolari, secondo le loro privacy policy.</li>
        <li><span className="font-medium">Autorità competenti:</span> in caso di obblighi di legge o richieste legittime.</li>
      </ul>

      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Cookie e tecnologie di tracciamento</h2>
      <p className="text-sm text-zinc-700 mb-3">
        Utilizziamo cookie funzionali, di preferenza, statistici e marketing. Per i dettagli e la gestione del consenso, consulta la nostra <a href="/cookies-policy" className="underline underline-offset-2">Cookies Policy</a> e il pannello "Gestisci cookie".
      </p>

      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Diritti dell'interessato</h2>
      <ul className="list-disc pl-6 text-sm text-zinc-700 space-y-2">
        <li>Accesso, rettifica, cancellazione, limitazione del trattamento.</li>
        <li>Portabilità dei dati e opposizione al trattamento, ove applicabile.</li>
        <li>Revoca del consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento basata sul consenso prima della revoca.</li>
        <li>Reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).</li>
      </ul>
      <p className="text-sm text-zinc-700 mb-3">
        Per esercitare i diritti, puoi contattarci all'indirizzo email <a href="mailto:info@gustomediterraneo.it" className="underline underline-offset-2">info@gustomediterraneo.it</a> o al numero +39 331 332 0411.
      </p>

      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Sicurezza</h2>
      <p className="text-sm text-zinc-700 mb-3">
        Applichiamo misure tecniche e organizzative adeguate per proteggere i dati personali, incluse autenticazione sicura, controlli di accesso e cifratura dei canali di comunicazione durante il pagamento (Stripe).
      </p>

      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Modifiche all'informativa</h2>
      <p className="text-sm text-zinc-700 mb-3">
        La presente informativa può essere soggetta a aggiornamenti. Le modifiche verranno pubblicate su questa pagina. Ti invitiamo a consultarla periodicamente.
      </p>

      <h2 className="text-lg font-semibold text-zinc-800 mt-6 mb-2">Contatti</h2>
      <p className="text-sm text-zinc-700">
        Per domande sulla privacy, puoi scrivere a <a href="mailto:info@gustomediterraneo.it" className="underline underline-offset-2">info@gustomediterraneo.it</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
