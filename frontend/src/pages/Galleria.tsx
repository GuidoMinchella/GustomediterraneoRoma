import React, { useState } from 'react';

const Galleria: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Categorie e immagini locali dal folder public/images
  const categories: Record<string, { label: string; images: string[] }> = {
    locale: {
      label: 'Locale',
      images: [
        '/images/locale.jpg',
        '/images/locale (2).jpg',
        '/images/locale (3).jpg',
      ],
    },
    panini: {
      label: 'Panini',
      images: [
        '/images/panini.jpg',
        '/images/panini (2).jpg',
        '/images/panini (3).jpg',
        '/images/panini (4).jpg',
        '/images/panini (5).jpg',
        '/images/panino.alici.jpg',
        '/images/panino.polpo.fritto.jpg',
        '/images/panino.polpo.rosticciato.jpg',
        '/images/panino.salmone.jpg',
      ],
    },
    fritti: {
      label: 'Fritti',
      images: [
        '/images/fritti.jpg',
        '/images/fritti (2).jpg',
        '/images/fritti (3).jpg',
        '/images/fritti (4).jpg',
        '/images/fritti (5).jpg',
        '/images/fritti (6).jpg',
        '/images/fritti (7).jpg',
        '/images/fritti (8).jpg',
        '/images/fritti (9).jpg',
        '/images/frittivari.jpg',
      ],
    },
    crudo: {
      label: 'Crudo',
      images: [
        '/images/crudo.jpg',
        '/images/crudo.webp',
        '/images/crudo (2).jpg',
        '/images/crudo (3).jpg',
        '/images/crudo (4).jpg',
        '/images/crudo (5).jpg',
        '/images/crudo (6).jpg',
        '/images/crudo (7).jpg',
        '/images/crudo (8).jpg',
        '/images/crudo (9).jpg',
        '/images/crudo (10).jpg',
        '/images/crudo (11).jpg',
        '/images/crudo (12).jpg',
      ],
    },
    specialita: {
      label: 'Specialità',
      images: [
        '/images/piatti.jpg',
        '/images/piatti (2).jpg',
        '/images/piatti (3).jpg',
        '/images/piatti (5).jpg',
        '/images/piatti (6).jpg',
        '/images/piatti (8).jpg',
        '/images/piatti (9).jpg',
        '/images/piatti (10).jpg',
        '/images/piatti (11).jpg',
        '/images/piatti (12).jpg',
        '/images/piatti (14).jpg',
        '/images/piatti (15).jpg',
        '/images/piatti (16).jpg',
        '/images/piatti (17).jpg',
        '/images/piatti (18).jpg',
        '/images/piatti (19).jpg',
        '/images/piatti (21).jpg',
        '/images/piatti (22).jpg',
        '/images/piatti (23).jpg',
        '/images/piatti (24).jpg',
        '/images/piatti (25).jpg',
        '/images/piatti (26).jpg',
        '/images/piatti (27).jpg',
        '/images/piatti (28).jpg',
        '/images/piatti (29).jpg',
        '/images/piatti (30).jpg',
        '/images/piatti (31).jpg',
        '/images/piatti (32).jpg',
        '/images/piatti (33).jpg',
        '/images/piatti (34).jpg',
        '/images/piatti (35).jpg',
        '/images/piatti (36).jpg',
        '/images/piatti (37).jpg',
        '/images/piatti (38).jpg',
        '/images/piatti (39).jpg',
        '/images/piatti (40).jpg',
        '/images/piatti (41).jpg',
        '/images/piatti (42).jpg',
        '/images/piatti (43).jpg',
        '/images/piatti (44).jpg',
        '/images/piatti (45).jpg',
        '/images/piatti (46).jpg',
        '/images/spiedini.jpg',
        '/images/insalata.di.mare.jpg',
        '/images/polpo.patate.jpg',
        '/images/salmone.crosta.di.pistacchio.mandorle.jpg',
        '/images/calamari.gratinati.alforno.jpg',
      ],
    },
  };

  const tags = [
    { id: 'all', label: 'Tutte le Foto' },
    { id: 'locale', label: 'Locale' },
    { id: 'panini', label: 'Panini' },
    { id: 'fritti', label: 'Fritti' },
    { id: 'crudo', label: 'Crudo' },
    { id: 'specialita', label: 'Specialità' },
  ];

  const orderedKeys: string[] = ['locale', 'panini', 'fritti', 'crudo', 'specialita'];
  const keysToRender = selectedTag === 'all' ? orderedKeys : orderedKeys.filter(k => k === selectedTag);

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/sfondohome.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              La nostra Galleria
            </h1>
            <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
              Un viaggio tra atmosfera, tradizione e sapori mediterranei che ci rappresentano.<br />
              Scorri tra il locale, i panini, i fritti, il crudo e le nostre specialità.
            </p>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedTag === tag.id
                    ? 'bg-mediterranean-marroncino text-white shadow-md'
                    : 'bg-white/90 text-gray-900 hover:bg-mediterranean-marroncino hover:text-white'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Sections by category */}
          <div className="space-y-12">
            {keysToRender.map((key) => {
              const section = categories[key];
              return (
                <section key={key}>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4 text-center">
                    {section.label}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {section.images.map((src, idx) => (
                      <div key={idx} className="relative aspect-square overflow-hidden rounded-lg">
                        <img
                          src={src}
                          alt={`${section.label} ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Galleria;
