import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

interface MiniWelcomeNotificationProps {
  onRegisterClick: () => void;
  onClose: () => void;
}

const MiniWelcomeNotification: React.FC<MiniWelcomeNotificationProps> = ({ 
  onRegisterClick, 
  onClose 
}) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-72 max-w-[calc(100vw-2rem)] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with image background (no overlay content) */}
        <div
          className="bg-contain bg-no-repeat bg-center h-16 sm:h-20"
          style={{ backgroundImage: "url('/images/Senza titolo (1024 x 200 px) (700 x 200 px).png')" }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="p-4">
          <div className="text-center mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <div className="text-lg font-bold text-green-600 mb-1">10% DI SCONTO</div>
              <div className="text-green-700 font-medium text-xs">sul tuo primo ordine!</div>
            </div>
            
            <p className="text-mediterranean-blu-scuro mb-3 leading-relaxed text-xs">
              Registrati ora e ottieni uno 
              <strong className="text-mediterranean-marroncino"> sconto esclusivo del 10%</strong> 
              sul tuo primo ordine.
            </p>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={onRegisterClick}
              className="w-full bg-gradient-to-r from-mediterranean-marroncino to-mediterranean-blu-scuro hover:from-mediterranean-blu-scuro hover:to-mediterranean-marroncino text-white font-semibold py-2 text-sm transition-all duration-300 transform hover:scale-105"
            >
              Registrati Ora!
            </Button>
            
            <button
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 text-xs transition-colors"
            >
              Non ora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniWelcomeNotification;