import React from 'react';

interface AllergenIconProps {
  allergen: string;
  className?: string;
}

/**
 * Render allergen icons using PNG images from public/images with no circle or background.
 */
const AllergenIcon: React.FC<AllergenIconProps> = ({ allergen, className }) => {
  const key = allergen.toLowerCase();

  const iconMap: Record<string, { src: string; alt: string }> = {
    'glutine': { src: '/images/glutine.png', alt: 'Glutine' },
    'latte': { src: '/images/latte.png', alt: 'Latte' },
    'lupini': { src: '/images/lupini.png', alt: 'Lupini' },
    'molluschi': { src: '/images/molluschi.png', alt: 'Molluschi' },
    'pesce': { src: '/images/pesce.png', alt: 'Pesce' },
    'sedano': { src: '/images/sedano.png', alt: 'Sedano' },
    'senape': { src: '/images/senape.png', alt: 'Senape' },
    'sesamo': { src: '/images/sesamo.png', alt: 'Sesamo' },
    'soia': { src: '/images/soia.png', alt: 'Soia' },
    'uova': { src: '/images/uova.png', alt: 'Uova' },
    'anidride solforosa/solfitti': { src: '/images/anidride.png', alt: 'Anidride solforosa/solfitti' },
    'solfiti': { src: '/images/anidride.png', alt: 'Solfiti' },
    'solfitti': { src: '/images/anidride.png', alt: 'Solfitti' },
    'arachidi': { src: '/images/arachidi.png', alt: 'Arachidi' },
    'crostacei': { src: '/images/crostacei.png', alt: 'Crostacei' },
    'frutta a guscio': { src: '/images/frutta a guscio.png', alt: 'Frutta a guscio' },
  };

  const icon = iconMap[key];

  return (
    <div className={`w-12 h-12 flex items-center justify-center ${className || ''}`}>
      {icon ? (
        <img src={icon.src} alt={icon.alt} className="w-10 h-10 object-contain" loading="lazy" />
      ) : (
        <span className="text-xs font-semibold">{(allergen[0] || '?').toUpperCase()}</span>
      )}
    </div>
  );
};

export default AllergenIcon;
