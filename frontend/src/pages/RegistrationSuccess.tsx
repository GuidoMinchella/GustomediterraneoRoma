import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

const RegistrationSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('Registrazione avvenuta con successo');

  useEffect(() => {
    const run = async () => {
      setError('');
      setSaving(true);

      try {
        const delayPromise = new Promise((res) => setTimeout(res, 1000));

        const payloadRaw = sessionStorage.getItem('registration_payload');
        const payload = payloadRaw ? JSON.parse(payloadRaw) as { fullName?: string; email?: string; password?: string } : {};

        // Recupera utente autenticato come fallback
        const { data: userData, error: getUserError } = await supabase.auth.getUser();
        if (getUserError) {
          console.warn('Errore recupero utente:', getUserError.message);
        }

        const email = payload.email || userData?.user?.email || '';
        const fullName = payload.fullName || (userData?.user?.user_metadata?.full_name as string) || '';
        const password = payload.password || '';

        if (!email) {
          throw new Error('Email non trovata. Per favore ripeti la registrazione.');
        }

        // Calcola hash password se disponibile
        let password_hash: string | null = null;
        if (password) {
          password_hash = await bcrypt.hash(password, 10);
        }

        const upsertPromise = (async () => {
          const { error: upsertErr } = await supabase
            .from('users')
            .upsert({
              nome: fullName || null,
              email: email,
              password_hash: password_hash,
              email_confermata: true,
              providers: 'registrazione',
            }, { onConflict: 'email' });
          if (upsertErr) throw upsertErr;
        })();

        await Promise.all([delayPromise, upsertPromise]);

        // Pulisci payload e mostra messaggio
        sessionStorage.removeItem('registration_payload');
        setMessage('Registrazione avvenuta con successo');
      } catch (e: any) {
        setError(e?.message || 'Errore durante il salvataggio dei dati');
        setMessage('Si è verificato un problema, riprova.');
      } finally {
        setSaving(false);
      }
    };

    run();
  }, []);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-xl font-semibold text-mediterranean-blu-scuro mb-3">{message}</h1>
      {saving && (
        <div className="text-sm text-gray-600 mb-3">Verifica e salvataggio in corso...</div>
      )}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md mb-3">{error}</div>
      )}
      {!saving && (
        <button
          onClick={handleContinue}
          className="w-full px-4 py-2 bg-mediterranean-marroncino text-white rounded hover:bg-mediterranean-blu-scuro transition"
        >
          Continua sul sito
        </button>
      )}
    </div>
  );
};

export default RegistrationSuccess;
