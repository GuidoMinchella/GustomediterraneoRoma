import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import Modal from '../UI/Modal';
import Button from '../UI/Button';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Le password non corrispondono');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      // Mostra feedback esplicito: controlla email di verifica
      // Nota: l'utente potrebbe non riceverla subito, offriamo reinvio.
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    const { error } = await signInWithGoogle();
    
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // Note: If successful, the user will be redirected and the component will unmount
  };

  const handleResendVerificationEmail = async () => {
    setResendLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) {
        setError(error.message || 'Errore nel reinvio dell\'email di verifica');
      } else {
        setSuccess(true);
      }
    } catch (e: any) {
      setError(e?.message || 'Errore nel reinvio dell\'email di verifica');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Registrati">
      {/* Discount Banner */}
      <div className="mb-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-green-100 rounded-full p-2 mr-3">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-mediterranean-blu-scuro">
              🎁 Benvenuto! Sconto del 10% sul primo ordine
            </h3>
            <p className="text-xs text-gray-600">
              Registrandoti ottieni subito uno sconto esclusivo di benvenuto
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
            Registrazione completata! Controlla la tua email per confermare l'account.
          </div>
        )}
        
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mediterranean-marroncino focus:border-transparent"
            placeholder="Il tuo nome completo"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mediterranean-marroncino focus:border-transparent"
            placeholder="La tua email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mediterranean-marroncino focus:border-transparent"
            placeholder="Almeno 6 caratteri"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Conferma Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mediterranean-marroncino focus:border-transparent"
            placeholder="Ripeti la password"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <Button type="submit" disabled={loading || success || googleLoading} className="w-full">
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </Button>
          {success && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">
              Registrazione completata. Controlla la tua email per confermare l'account.
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={handleResendVerificationEmail}
            disabled={loading || googleLoading || resendLoading || !email}
            className="w-full"
          >
            {resendLoading ? 'Invio in corso...' : 'Reinvia email di verifica'}
          </Button>
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">oppure</span>
            </div>
          </div>
          
          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={loading || success || googleLoading}
            className="w-full flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>{googleLoading ? 'Connessione...' : 'Continua con Google'}</span>
          </Button>
          
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-mediterranean-marroncino hover:text-mediterranean-blu-scuro transition-colors"
          >
            Hai già un account? Accedi
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RegisterModal;