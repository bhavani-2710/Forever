import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import ProtectedRoute from './components/ProtectedRoute';
import { useContext } from 'react';
import { ShopContext } from './context/ShopContext';

const App = () => {
  const { authenticated, setAuthenticated, loading } = useContext(ShopContext);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/login" element={<Login authenticated={authenticated} setAuthenticated={setAuthenticated} />} />

        {/* ---------------- PROTECTED ROUTES -------------- */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute authenticated={authenticated} loading={loading}>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/place-order"
          element={
            <ProtectedRoute authenticated={authenticated} loading={loading}>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute authenticated={authenticated} loading={loading}>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
