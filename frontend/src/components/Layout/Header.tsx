import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Home, ChefHat, Calendar, Image as ImageIcon, Phone as PhoneIcon } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../Auth/LoginModal';
import RegisterModal from '../Auth/RegisterModal';

import Button from '../UI/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const location = useLocation();
  const { itemsCount } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/menu-fisso', label: 'Menù Fisso' },
    { path: '/menu-del-giorno', label: 'Menù del Giorno' },
    { path: '/prenota', label: 'Prenota Ordine' },
    { path: '/galleria', label: 'Galleria' },
    { path: '/contatti', label: 'Contatti' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      setIsMenuOpen(false);
      navigate('/');
    }
  };

  return (
    <header className="bg-mediterranean-bianco shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src="/images/Senza titolo (1024 x 200 px) (700 x 200 px).png" 
              alt="Gusto Mediterraneo" 
              className="h-12 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-mediterranean-marroncino ${
                  isActive(item.path) 
                    ? 'text-mediterranean-marroncino border-b-2 border-mediterranean-marroncino' 
                    : 'text-mediterranean-blu-scuro'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Cart Icon (only if logged in) */}
            {user && (
              <Link to="/prenota" data-cart-icon="true" className="relative p-2 text-mediterranean-blu-scuro hover:text-mediterranean-marroncino transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-mediterranean-marroncino text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* Authentication */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 p-2 text-mediterranean-blu-scuro hover:text-mediterranean-marroncino transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden lg:block text-sm font-medium">
                    Dashboard
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-mediterranean-blu-scuro hover:text-mediterranean-marroncino transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Button
                onClick={() => setIsLoginModalOpen(true)}
                size="sm"
                className="ml-4"
              >
                Accedi
              </Button>
            )}
          </div>

          {/* Mobile controls: cart (if logged in) + menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <Link
                to="/prenota"
                data-cart-icon="true"
                className="relative p-2 text-mediterranean-blu-scuro hover:text-mediterranean-marroncino transition-colors"
                aria-label="Carrello"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-mediterranean-marroncino text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-mediterranean-blu-scuro hover:text-mediterranean-marroncino transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Overlay per chiusura clic fuori dal menu su mobile */}
        {isMenuOpen && (
          <div
            className="md:hidden fixed inset-0 top-16 z-40 bg-black/0"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Navigation */}
        <div
          className={`md:hidden ${isMenuOpen ? 'dropdown-anim open' : 'dropdown-anim'} fixed top-16 left-0 right-0 z-50`}
          aria-hidden={!isMenuOpen}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="ml-auto w-[68%] sm:max-w-[340px] max-w-[300px] px-2 pt-2 pb-2 space-y-1 bg-mediterranean-marroncino text-white rounded-lg max-h-[60vh] overflow-y-auto animate-slide-in-down shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item, i) => {
              const icon = (
                item.path === '/' ? <Home className="w-4 h-4 mr-2" /> :
                item.path === '/menu-fisso' ? <ChefHat className="w-4 h-4 mr-2" /> :
                item.path === '/menu-del-giorno' ? <Calendar className="w-4 h-4 mr-2" /> :
                item.path === '/prenota' ? <Calendar className="w-4 h-4 mr-2" /> :
                item.path === '/galleria' ? <ImageIcon className="w-4 h-4 mr-2" /> :
                item.path === '/contatti' ? <PhoneIcon className="w-4 h-4 mr-2" /> : null
              );
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors fade-slide-in text-white hover:text-white/90 ${
                    isActive(item.path) ? '' : ''
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="flex items-center">{icon}{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Authentication */}
            <div className="border-t border-white/20 pt-2 mt-2">
              {user ? (
                <div className="px-3 py-2 space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center text-white hover:text-white/90 transition-colors fade-slide-in"
                    style={{ animationDelay: `${navItems.length * 60}ms` }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center text-white hover:text-white/90 transition-colors fade-slide-in"
                    style={{ animationDelay: `${navItems.length * 60 + 60}ms` }}
                  >
                    Esci
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2">
                  <Button
                    onClick={() => {
                      setIsLoginModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    size="sm"
                    className="w-full fade-slide-in"
                    style={{ animationDelay: `${navItems.length * 60}ms` }}
                  >
                    Accedi
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={handleSwitchToRegister}
        />
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </nav>
    </header>
  );
};

export default Header;
