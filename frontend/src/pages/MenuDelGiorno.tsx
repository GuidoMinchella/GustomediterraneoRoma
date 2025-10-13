import React, { useEffect, useState } from 'react';
import { Clock, Plus, AlertCircle, ChefHat, Phone } from 'lucide-react';
import { useDish } from '../context/DishContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import LoginModal from '../components/Auth/LoginModal';
import RegisterModal from '../components/Auth/RegisterModal';
import { animateToCart } from '../utils/animateToCart';
import AllergenIcon from '../components/Admin/AllergenIcon';
import AllergenLegend from '../components/AllergenLegend';

const MenuDelGiorno: React.FC = () => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { dailyMenuDishes, loading, fetchMenuDishes } = useDish();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [weights, setWeights] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchMenuDishes('daily');
  }, [fetchMenuDishes]);

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>, dish: any) => {
    // Verifica se l'utente è autenticato
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    await animateToCart(e.currentTarget as HTMLElement, dish?.image_url);

    const isByWeight = dish?.pricing_type === 'by_weight' || (Array.isArray(dish.tags) && dish.tags.includes('by_weight'));
    if (isByWeight) {
      const grams = weights[dish.id] || 100;
      const unitTotal = (dish.price || 0) * (grams / 100);
      addItem({
        id: dish.id,
        name: dish.name,
        price: unitTotal,
        category: dish.category,
        pricing_type: 'by_weight',
        weight_grams: grams,
        notes: `${grams}g @ €${dish.price.toFixed(2)}/100g`
      });
    } else {
      addItem({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        category: dish.category,
        pricing_type: 'fixed'
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'antipasti': 'Antipasti',
      'primi': 'Primi Piatti',
      'secondi': 'Secondi Piatti',
      'contorni': 'Contorni',
      'fritture': 'Fritture',
      'panini': 'Panini',
      'vini': 'Vini',
      'bevande': 'Bevande',
      'birre': 'Birre'
    };
    return labels[category] || category;
  };

  // Ordine e label delle categorie come nel Menu Fisso
  const categories = [
    { id: 'antipasti', label: 'Antipasti' },
    { id: 'primi', label: 'Primi Piatti' },
    { id: 'secondi', label: 'Secondi Piatti' },
    { id: 'contorni', label: 'Contorni e Insalate' },
    { id: 'fritture', label: 'Fritture' },
    { id: 'panini', label: 'Panini' },
    { id: 'vini', label: 'Vini' },
    { id: 'bevande', label: 'Bevande' },
    { id: 'birre', label: 'Birre' },
  ];

  const today = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-mediterranean-beige py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediterranean-marroncino"></div>
            <span className="ml-3 text-mediterranean-blu-scuro">Caricamento menu del giorno...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mediterranean-beige py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-mediterranean-blu-scuro mb-4">
            Menù del Giorno
          </h1>
          <p className="text-lg text-mediterranean-marroncino mb-2">
            {today}
          </p>
          <p className="text-lg text-mediterranean-blu-scuro max-w-2xl mx-auto">
            Le nostre specialità quotidiane preparate con il pescato fresco del giorno.
          </p>
        </div>

        {/* Crudo su Ordinazione con immagine di sfondo e overlay scuro */}
        <div className="mb-4">
          <Card className="relative overflow-hidden text-white h-full">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/img5.jpg')" }}
              aria-hidden="true"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

            {/* Content */}
            <div className="relative text-center py-3 md:py-4 px-4">
              <ChefHat className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-white" />
              <h3 className="font-serif text-lg md:text-xl font-bold mb-2">
                Crudo di Pesce Fresco
              </h3>
              <p className="text-white/90 mb-3 max-w-2xl mx-auto text-sm md:text-base">
                Su ordinazione è possibile gustare il nostro crudo di pesce freschissimo,
                preparato con il pescato del giorno. <strong>Prenotazione richiesta almeno un giorno prima.</strong>
              </p>
              <Button
                onClick={() => window.open('tel:+393123456789', '_self')}
                className="bg-mediterranean-marroncino hover:bg-mediterranean-marroncino/90 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg transition-colors duration-200 inline-flex items-center text-sm md:text-base"
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Chiama per Prenotare
              </Button>
            </div>
          </Card>
        </div>

        {/* Separatore bianco sfumato e sezione salse */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="h-[2px] w-full bg-gradient-to-r from-white/0 via-white/90 to-white/0" />
          </div>
          <p className="mt-3 text-center italic text-mediterranean-blu-scuro/80">
            *tutte le salse che offriamo sono preparate da noi*
          </p>
        </div>
        

        {/* Legenda Allergeni (tendina sotto salse, desktop e mobile) */}
        <AllergenLegend />

        {/* Today's Specials raggruppati per categoria */}
        {dailyMenuDishes.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="w-24 h-24 text-mediterranean-marroncino mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-serif font-semibold text-mediterranean-blu-scuro mb-4">
              Menu del Giorno in Preparazione
            </h3>
            <p className="text-lg text-mediterranean-blu-scuro max-w-md mx-auto">
              Il nostro chef sta preparando le specialità del giorno. 
              Torna presto per scoprire le delizie fresche di oggi!
            </p>
          </div>
        ) : (
          <div className="space-y-12 mb-12">
            {categories.map(category => {
              const items = dailyMenuDishes.filter(a => a.dish && a.dish.category === category.id);
              if (items.length === 0) return null;

              return (
                <div key={category.id}>
                  <h2 className="font-serif text-2xl font-bold text-mediterranean-blu-scuro mb-4 text-center">
                    {category.label}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(assignment => {
                      const dish = assignment.dish!;
                      return (
                        <Card key={assignment.id} className="h-full flex flex-col relative overflow-hidden">
                          {/* Special Badge */}
                          <div className="absolute top-4 right-4 z-10">
                            <span className="bg-mediterranean-marroncino text-mediterranean-bianco px-3 py-1 rounded-full text-sm font-medium">
                              Speciale
                            </span>
                          </div>

                          {/* Image */}
                          {dish.image_url && (
                            <div className="w-full h-40 overflow-hidden">
                              <img
                                src={dish.image_url}
                                alt={dish.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start mb-2 gap-2">
                              <h3 className="font-serif text-lg font-semibold text-mediterranean-blu-scuro pr-4 flex-1 min-w-0 break-words">
                                {dish.name}
                              </h3>
                              <span className="text-lg font-bold text-mediterranean-marroncino shrink-0">
                                {(dish.pricing_type === 'by_weight' || dish.tags?.includes('by_weight'))
                                  ? `${formatPrice(dish.price)} / 100g`
                                  : `${formatPrice(dish.price)}`}
                              </span>
                            </div>
                            

                            <p className="text-mediterranean-blu-scuro mb-3 leading-relaxed">
                              {dish.description}
                            </p>

                            {/* Category */}
                            <div className="mb-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-mediterranean-beige text-mediterranean-blu-scuro">
                                {getCategoryLabel(dish.category)}
                              </span>
                            </div>

                            {/* Allergens */}
                            {dish.allergens.length > 0 && (
                              <div className="mb-3">
                                <div className="flex flex-wrap gap-2 items-center">
                                  {dish.allergens.map((allergen, index) => (
                                    <AllergenIcon key={`${dish.id}-${index}`} allergen={allergen} />
                                  ))}
                                </div>
                              </div>
                            )}
                            {(dish.pricing_type === 'by_weight' || dish.tags?.includes('by_weight')) && (
                              <div className="mb-4 p-3 bg-mediterranean-beige/50 border border-mediterranean-marroncino/30 rounded-lg">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-mediterranean-marroncino/20 hover:bg-mediterranean-marroncino/30 text-mediterranean-marroncino text-xl font-bold flex items-center justify-center"
                                      onClick={() => setWeights(prev => {
                                        const current = prev[dish.id] ?? 100;
                                        const next = Math.max(50, current - 50);
                                        return { ...prev, [dish.id]: next };
                                      })}
                                    >
                                      -
                                    </button>
                                    <span className="font-semibold min-w-[70px] text-center text-lg sm:text-xl">
                                      {(weights[dish.id] ?? 100)}g
                                    </span>
                                    <button
                                      type="button"
                                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-mediterranean-marroncino/20 hover:bg-mediterranean-marroncino/30 text-mediterranean-marroncino text-xl font-bold flex items-center justify-center"
                                      onClick={() => setWeights(prev => {
                                        const current = prev[dish.id] ?? 100;
                                        const next = current + 50;
                                        return { ...prev, [dish.id]: next };
                                      })}
                                    >
                                      +
                                    </button>
                                  </div>
                                  <span className="ml-2 text-mediterranean-marroncino font-bold text-lg sm:text-xl break-words">
                                    Totale: {formatPrice((dish.price || 0) * ((weights[dish.id] ?? 100) / 100))}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">Regola il peso in step da 50g</p>
                              </div>
                            )}
                          </div>

                          <div className="p-4 pt-0">
                            <Button
                              onClick={(e) => handleAddToCart(e, dish)}
                              className="w-full"
                              disabled={!assignment.is_available || !dish.available}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {(assignment.is_available && dish.available) ? 'Aggiungi al Carrello' : 'Non Disponibile'}
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sezioni informative e CTA rimosse su richiesta */}
      </div>

      {/* Modali di Autenticazione */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </div>
  );
};

export default MenuDelGiorno;
