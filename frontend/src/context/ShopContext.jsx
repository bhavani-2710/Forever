import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = props => {
  const currency = `₹`;
  const delivery_fee = 10;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Select Product Size');
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    if (authenticated) {
      try {
        const response = await axios.post(`${BACKEND_URL}/api/cart/add`, { productId: itemId, size }, { withCredentials: true });
        if (response.data.success) {
          toast.success(response.data.message, { autoClose: 2000 });
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

  // Update quantity of selected cart items
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (authenticated) {
      try {
        const response = await axios.patch(`${BACKEND_URL}/api/cart/update`, { productId: itemId, size, quantity }, { withCredentials: true });
        if (response.data.success) {
          toast.success(response.data.message, { autoClose: 2000 });
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };

  // To find total price of all cart items
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find(product => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item]; // price * quantity
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  const fetchProductsData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const getUserCartData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/cart/get-cart`, { withCredentials: true });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      if (error.response.data.message !== 'Not Authorized! Login again.') {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/check-auth`, {
          withCredentials: true
        });
        if (res.data.success) {
          setAuthenticated(true); // user is logged in
        }
      } catch (err) {
        setAuthenticated(false); // not logged in
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
    getUserCartData();
  }, [authenticated]);

  useEffect(() => {
    fetchProductsData();
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    BACKEND_URL,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    authenticated,
    setAuthenticated,
    loading,
    setLoading,
    navigate
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
