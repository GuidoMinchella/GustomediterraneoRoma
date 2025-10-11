import React, { useState, useEffect } from 'react';
import { useDish } from '../../context/DishContext';
import { Plus, Trash2, ChefHat } from 'lucide-react';
import Button from '../UI/Button';
import AddDishModal from './AddDishModal';
import AllergenIcon from './AllergenIcon';

const MenuDelGiornoManagement: React.FC = () => {
  const { 
    dailyMenuDishes, 
    loading, 
    fetchMenuDishes, 
    addDishToMenu, 
    removeDishFromMenu 
  } = useDish();
  
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchMenuDishes('daily');
  }, [fetchMenuDishes]);

  const handleAddDish = async (dishId: string) => {
    try {
      console.log('MenuDelGiornoManagement: handleAddDish called with dishId:', dishId);
      await addDishToMenu(dishId, 'daily');
      console.log('MenuDelGiornoManagement: addDishToMenu completed successfully');
      setShowAddModal(false);
    } catch (error) {
      console.error('Errore nell\'aggiunta del piatto:', error);
    }
  };

  const handleRemoveDish = async (dishId: string) => {
    try {
      await removeDishFromMenu(dishId, 'daily');
    } catch (error) {
      console.error('Errore nella rimozione del piatto:', error);
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

  // Ottieni gli ID dei piatti già nel menu per escluderli dal modal
  const excludeDishIds = dailyMenuDishes.map(assignment => assignment.dish_id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        <span className="ml-3 text-gray-600">Caricamento menu del giorno...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Menu del Giorno</h2>
        <p className="text-gray-600 mt-2">Gestisci i piatti disponibili nel menu del giorno</p>
        <div className="mt-4">
          <Button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Aggiungi Piatto</span>
          </Button>
        </div>
      </div>

      {/* Lista piatti */}
      {dailyMenuDishes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nessun piatto nel menu del giorno
          </h3>
          <p className="text-gray-600 mb-4">
            Inizia aggiungendo alcuni piatti al menu del giorno
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Aggiungi Primo Piatto</span>
          </Button>
        </div>
      ) : (
        (() => {
          const grouped: Record<string, typeof dailyMenuDishes> = {};
          dailyMenuDishes.forEach((assignment) => {
            const cat = assignment.dish?.category || 'altro';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(assignment);
          });

          const orderedCategories = Object.keys(grouped).sort((a, b) =>
            getCategoryLabel(a).localeCompare(getCategoryLabel(b))
          );

          return (
            <div className="space-y-8">
              {orderedCategories.map((cat) => (
                <div key={cat}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {getCategoryLabel(cat)}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grouped[cat].map((assignment) => {
                      const dish = assignment.dish;
                      if (!dish) return null;
                      return (
                        <div
                          key={assignment.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          {dish.image_url && (
                            <img
                              src={dish.image_url}
                              alt={dish.name}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                {dish.name}
                              </h4>
                              <span className="text-lg font-bold text-amber-600">
                                {(dish.pricing_type === 'by_weight' || dish.tags?.includes('by_weight'))
                                  ? `${formatPrice(dish.price)} / 100g`
                                  : `${formatPrice(dish.price)}`}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {dish.description}
                            </p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {getCategoryLabel(dish.category)}
                              </span>
                              {assignment.is_available && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Disponibile
                                </span>
                              )}
                            </div>
                            {dish.allergens.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3 items-center">
                                {dish.allergens.slice(0, 6).map((allergen, index) => (
                                  <AllergenIcon key={`${assignment.dish_id}-${index}`} allergen={allergen} />
                                ))}
                                {dish.allergens.length > 6 && (
                                  <span className="text-xs text-gray-500">
                                    +{dish.allergens.length - 6} altri
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleRemoveDish(assignment.dish_id)}
                                variant="outline"
                                size="sm"
                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Rimuovi
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()
      )}

      {/* Modal per aggiungere piatti */}
      <AddDishModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddDish={handleAddDish}
        menuType="daily"
        title="Aggiungi Piatto al Menu del Giorno"
        excludeDishIds={excludeDishIds}
      />
    </div>
  );
};

export default MenuDelGiornoManagement;
