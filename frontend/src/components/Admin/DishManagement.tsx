import React, { useState, useEffect } from 'react';
import { useDish } from '../../context/DishContext';
import { Dish } from '../../context/DishContext';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import AllergenIcon from './AllergenIcon';
import Button from '../UI/Button';

const DishManagement: React.FC = () => {
  const { dishes, loading, error, addDish, updateDish, deleteDish, fetchDishes } = useDish();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [pricingType, setPricingType] = useState<'fixed' | 'by_weight'>('fixed');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'antipasti' as 'antipasti' | 'primi' | 'secondi' | 'contorni' | 'fritture' | 'panini' | 'vini' | 'bevande' | 'birre',
    allergens: [] as string[],
    tags: [] as string[],
    image_url: '',
    available: true,
    limited_quantity: false
  });

  const categories = ['antipasti', 'primi', 'secondi', 'contorni', 'fritture', 'panini', 'vini', 'bevande', 'birre'];
  const commonAllergens: { key: string; label: string }[] = [
    { key: 'glutine', label: 'Glutine' },
    { key: 'crostacei', label: 'Crostacei' },
    { key: 'uova', label: 'Uova' },
    { key: 'pesce', label: 'Pesce' },
    { key: 'arachidi', label: 'Arachidi' },
    { key: 'soia', label: 'Soia' },
    { key: 'latte', label: 'Latte' },
    { key: 'frutta a guscio', label: 'Frutta a guscio' },
    { key: 'sedano', label: 'Sedano' },
    { key: 'senape', label: 'Senape' },
    { key: 'sesamo', label: 'Sesamo' },
    { key: 'anidride solforosa/solfitti', label: 'Anidride solforosa/solfitti' },
    { key: 'lupini', label: 'Lupini' },
    { key: 'molluschi', label: 'Molluschi' },
  ];

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]); // Ora fetchDishes è memoizzato, quindi è sicuro includerlo

  // Se c'è un errore, mostra un messaggio di errore
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Errore nel caricamento dei piatti
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {error}
              </p>
              <p className="text-sm text-red-600 mt-2">
                Assicurati che la tabella 'dishes' sia stata creata in Supabase con lo schema corretto.
              </p>
              <Button 
                onClick={fetchDishes} 
                className="mt-3 bg-red-600 hover:bg-red-700"
                size="sm"
              >
                Riprova
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se è in caricamento, mostra un indicatore di caricamento migliorato
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mediterranean-marroncino mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento piatti in corso...</p>
            <p className="text-sm text-gray-500 mt-2">
              Se il caricamento persiste, verifica la connessione a Supabase
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rimuovi qualsiasi tag 'by_weight': non serve mostrarlo nei tag
    const nextTags = Array.from(new Set(
      (formData.tags || [])
        .filter(t => t !== 'by_weight')
    ));

    const dishData = {
      ...formData,
      price: parseFloat(formData.price),
      tags: nextTags,
      pricing_type: pricingType
    };

    try {
      if (editingDish) {
        await updateDish(editingDish.id, dishData);
      } else {
        await addDish(dishData);
      }
      
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Errore nel salvare il piatto:', error);
      // Mostra un messaggio di errore più dettagliato
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      alert(`Errore nel salvare il piatto: ${errorMessage}`);
    }
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price.toString(),
      category: dish.category,
      allergens: dish.allergens || [],
      tags: dish.tags || [],
      image_url: dish.image_url || '',
      available: dish.available,
      limited_quantity: dish.limited_quantity || false
    });
    setPricingType(dish.pricing_type === 'by_weight' || dish.tags?.includes('by_weight') ? 'by_weight' : 'fixed');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questo piatto?')) {
      try {
        await deleteDish(id);
      } catch (error) {
        console.error('Errore nell\'eliminare il piatto:', error);
        alert('Errore nell\'eliminare il piatto');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'antipasti',
      allergens: [],
      tags: [],
      image_url: '',
      available: true,
      limited_quantity: false
    });
    setPricingType('fixed');
    setEditingDish(null);
  };

  const handleAllergenToggle = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleTagChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  // Render principale del componente
  return (
    <div className="px-2 sm:px-6 py-4 sm:py-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestione Piatti</h2>
        <p className="text-gray-600 mt-2">Gestisci il menu del ristorante - {dishes.length} piatti totali</p>
        <div className="mt-4">
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Aggiungi Piatto
          </Button>
        </div>
      </div>

      {/* Lista piatti */}
      {dishes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun piatto trovato</h3>
          <p className="text-gray-600 mb-4">
            Inizia aggiungendo il primo piatto al menu del ristorante.
          </p>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Aggiungi il primo piatto
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {categories.map(category => {
            const categoryDishes = dishes.filter(dish => dish.category === category);
            if (categoryDishes.length === 0) return null;

            return (
              <div key={category} className="w-full">
                <div className="grid w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3 sm:gap-6 place-items-stretch">
                  {categoryDishes.map(dish => (
                    <div key={dish.id} className="bg-white rounded-lg border p-4 hover:shadow-sm w-full overflow-hidden break-words">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">
                              {dish.name}
                            </h4>
                            <span className="text-lg font-bold text-mediterranean-marroncino">
                              {dish.tags?.includes('by_weight')
                                ? `€${dish.price.toFixed(2)} / 100g`
                                : `€${dish.price.toFixed(2)}`}
                            </span>
                            {!dish.available && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                Non disponibile
                              </span>
                            )}
                            {dish.limited_quantity && (
                              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                Quantità limitata
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{dish.description}</p>

                          {dish.allergens && dish.allergens.length > 0 && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700 mr-2">Allergeni:</span>
                              <div className="flex flex-wrap gap-2 items-center">
                                {dish.allergens.map((a) => (
                                  <AllergenIcon key={`${dish.id}-${a}`} allergen={a} />
                                ))}
                              </div>
                            </div>
                          )}

                          {dish.tags && dish.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {dish.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {dish.image_url && (
                          <div className="ml-4 flex-shrink-0">
                            <img
                              src={dish.image_url}
                              alt={dish.name}
                              className="sm:w-20 sm:h-20 w-16 h-16 object-cover rounded-lg max-w-full"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={() => handleEdit(dish)}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                        >
                          <Edit2 className="w-4 h-4" />
                          Modifica
                        </button>
                        <button
                          onClick={() => handleDelete(dish.id)}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                          Elimina
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal per Aggiungere/Modificare Piatto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingDish ? 'Modifica Piatto' : 'Aggiungi Nuovo Piatto'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Piatto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrizione *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipologia prezzo *
                  </label>
                  <select
                    value={pricingType}
                    onChange={(e) => setPricingType(e.target.value as 'fixed' | 'by_weight')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    <option value="fixed">A prezzo</option>
                    <option value="by_weight">A peso (€/100g)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {pricingType === 'by_weight' ? 'Prezzo per 100g (€) *' : 'Prezzo (€) *'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {pricingType === 'by_weight'
                      ? 'Inserisci il prezzo riferito a 100g (es. 10.00 = 10€/100g)'
                      : 'Inserisci il prezzo fisso del piatto (es. 12.00)'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Immagine
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="/images/nome-file.jpg o https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergeni
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {commonAllergens.map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 p-2 rounded-md border border-gray-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer">
                      <AllergenIcon allergen={key} />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <input
                        type="checkbox"
                        checked={formData.allergens.includes(key)}
                        onChange={() => handleAllergenToggle(key)}
                        className="ml-auto accent-orange-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag (separati da virgola)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="es: vegetariano, piccante, stagionale"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Disponibile</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.limited_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, limited_quantity: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">Quantità limitata</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  {editingDish ? 'Aggiorna' : 'Aggiungi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishManagement;
