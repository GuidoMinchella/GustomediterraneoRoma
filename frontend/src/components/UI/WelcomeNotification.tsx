import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import Button from './Button';

interface WelcomeNotificationProps {
  onRegisterClick: () => void;
  onClose: () => void;
}

const WelcomeNotification: React.FC<WelcomeNotificationProps> = ({ onRegisterClick, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs md:max-w-sm mx-2 sm:mx-4 relative overflow-hidden max-h-[88vh] overflow-y-auto">
        {/* Close button */}
        <button
          aria-label="Chiudi"
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full p-1 bg-zinc-100/90 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900 ring-1 ring-zinc-300 shadow-sm transition-colors z-10"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Header with image background */}
        <div
          className="bg-contain bg-no-repeat bg-center h-16 sm:h-20 md:h-24"
          style={{ backgroundImage: "url('/images/Senza titolo (1024 x 200 px) (700 x 200 px).png')" }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="p-3 sm:p-4">
          <div className="text-center mb-4 sm:mb-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-2 sm:p-3 mb-3 sm:mb-4">
              <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">10% DI SCONTO</div>
              <div className="text-green-700 font-medium text-xs sm:text-sm">sul tuo primo ordine!</div>
            </div>
            
            <p className="text-mediterranean-blu-scuro mb-3 sm:mb-4 leading-relaxed text-xs sm:text-sm">
              Registrati ora e scopri i sapori autentici del Mediterraneo con uno 
              <strong className="text-mediterranean-marroncino"> sconto esclusivo del 10%</strong> 
              sul tuo primo ordine.
            </p>

            <div className="bg-mediterranean-beige rounded-lg p-2 sm:p-3 mb-4 sm:mb-6">
              <h3 className="font-semibold text-mediterranean-blu-scuro mb-2 flex items-center justify-center text-xs sm:text-sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Vantaggi della registrazione:
              </h3>
              <ul className="text-xs sm:text-sm text-mediterranean-blu-scuro space-y-1">
                <li>✨ Sconto del 10% sul primo ordine</li>
                <li>🍽️ Sconti futuri per ordini superiori a 40€</li>
                <li>📱 Gestione facile dei tuoi ordini</li>
                <li>⚡ Checkout più veloce</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Button 
              onClick={onRegisterClick}
              className="w-full bg-gradient-to-r from-mediterranean-marroncino to-mediterranean-blu-scuro hover:from-mediterranean-blu-scuro hover:to-mediterranean-marroncino text-white font-semibold py-2 sm:py-2.5 text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
            >
              Registrati Ora e Risparmia!
            </Button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 text-xs sm:text-sm transition-colors"
            >
              Continua senza registrazione
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeNotification;
