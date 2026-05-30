import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }     from './context/AuthContext';
import { CartProvider }     from './context/CartContext';
import Navbar               from './components/Navbar';
import ProtectedRoute       from './components/ProtectedRoute';
import Products             from './pages/Products';
import ProductDetail        from './pages/ProductDetail';
import Login                from './pages/Login';
import Register             from './pages/Register';
import Cart                 from './pages/Cart';
import Checkout             from './pages/Checkout';
import Orders               from './pages/Orders';
import Profile              from './pages/Profile';
import Admin                from './pages/Admin';
import NotFound             from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/"            element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/cart"        element={<Cart />} />
            <Route path="/checkout"    element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders"      element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin"       element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="*"            element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}