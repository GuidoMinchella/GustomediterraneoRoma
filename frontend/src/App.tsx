import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DishProvider } from './context/DishContext';
import Layout from './components/Layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import AdminRoute from './components/ProtectedRoute/AdminRoute';
import Home from './pages/Home';
import MenuFisso from './pages/MenuFisso';
import MenuDelGiorno from './pages/MenuDelGiorno';
import Prenotazione from './pages/Prenotazione';
import Pagamento from './pages/Pagamento';
import Galleria from './pages/Galleria';
import Contatti from './pages/Contatti';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import RegistrationSuccess from './pages/RegistrationSuccess';
import CookieConsent from './components/CookieConsent';
import CookiesPolicy from './pages/CookiesPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <AuthProvider>
      <DishProvider>
        <CartProvider>
          <ScrollToTop />
          <Layout>
            <CookieConsent />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu-fisso" element={<MenuFisso />} />
              <Route path="/menu-del-giorno" element={<MenuDelGiorno />} />
              <Route path="/prenota" element={<Prenotazione />} />
              <Route path="/prenotazione" element={<Prenotazione />} />
              <Route path="/pagamento" element={<Pagamento />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/galleria" element={<Galleria />} />
              <Route path="/contatti" element={<Contatti />} />
              <Route path="/registrazione-successo" element={<RegistrationSuccess />} />
              <Route path="/cookies-policy" element={<CookiesPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
            </Routes>
          </Layout>
        </CartProvider>
      </DishProvider>
    </AuthProvider>
  );
}

export default App;
