import React, { useState } from 'react';
import AllergenIcon from './Admin/AllergenIcon';

interface LegendItem {
  key: string;
  label: string;
  description: string;
}

const items: LegendItem[] = [
  {
    key: 'glutine',
    label: 'GLUTINE',
    description:
      'Cereali contenenti glutine, cioè grano, segale, orzo, avena, farro, kamut o i loro ceppi derivati e prodotti derivati',
  },
  {
    key: 'crostacei',
    label: 'CROSTACEI',
    description: 'Crostacei e prodotti a base di crostacei',
  },
  {
    key: 'uova',
    label: 'UOVA',
    description: 'Uova e prodotti a base di uova',
  },
  {
    key: 'pesce',
    label: 'PESCE',
    description: 'Pesce e prodotti a base di pesce',
  },
  {
    key: 'arachidi',
    label: 'ARACHIDI',
    description: 'Arachidi e prodotti a base di arachidi',
  },
  {
    key: 'soia',
    label: 'SOIA',
    description: 'Soia e prodotti a base di soia',
  },
  {
    key: 'latte',
    label: 'LATTE',
    description: 'Latte e prodotti a base di latte (incluso lattosio)',
  },
  {
    key: 'frutta a guscio',
    label: 'FRUTTA A GUSCIO',
    description:
      'Frutta a guscio, vale a dire mandorle, nocciole, noci, noci di acagiù, noci di pecan, noci del Brasile, pistacchi, noci macadamia o noci del Queensland, e i loro prodotti',
  },
  {
    key: 'sedano',
    label: 'SEDANO',
    description: 'Sedano e prodotti a base di sedano',
  },
  {
    key: 'senape',
    label: 'SENAPE',
    description: 'Senape e prodotti a base di senape',
  },
  {
    key: 'sesamo',
    label: 'SESAMO',
    description: 'Semi di sesamo e prodotti a base di semi di sesamo',
  },
  {
    key: 'anidride solforosa/solfitti',
    label: 'ANIDRIDE SOLFOROSA, SOLFITI',
    description:
      'Anidride solforosa e solfiti in concentrazioni superiori a 10 mg/kg',
  },
  {
    key: 'lupini',
    label: 'LUPINI',
    description: 'Lupini e prodotti a base di lupini',
  },
  {
    key: 'molluschi',
    label: 'MOLLUSCHI',
    description: 'Molluschi e prodotti a base di molluschi',
  },
];

interface AllergenLegendProps {
  className?: string;
}

const AllergenLegend: React.FC<AllergenLegendProps> = ({ className }) => {
  const [open, setOpen] = useState(false);

  return (
    <section className={`mt-4 ${className || ''}`}>
      {/* Toggle button (desktop e mobile) */}
      <div className="mb-3 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="px-4 py-2 rounded-lg bg-mediterranean-marroncino text-white font-semibold shadow hover:bg-mediterranean-marroncino/90 transition-colors"
        >
          {open ? 'Chiudi legenda allergeni' : 'Apri legenda allergeni'}
        </button>
      </div>

      {/* Legend panel (collassabile su tutti i dispositivi) */}
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[1500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-mediterranean-marroncino/15 border border-mediterranean-marroncino/20 rounded-lg p-3">
          <h2 className="font-serif text-xl font-bold text-mediterranean-blu-scuro mb-1 text-center">Legenda Allergeni</h2>
          <p className="text-center text-mediterranean-blu-scuro/80 mb-3 text-sm">
            Le informazioni circa la presenza di sostanze che provocano allergia o intolleranze
          </p>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.key} className="flex items-start gap-2">
                <div className="shrink-0">
                  <AllergenIcon allergen={item.key} className="w-7 h-7 scale-90" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-mediterranean-blu-scuro text-sm">{item.label}</div>
                  <div className="text-xs text-mediterranean-blu-scuro/80 leading-snug">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllergenLegend;
