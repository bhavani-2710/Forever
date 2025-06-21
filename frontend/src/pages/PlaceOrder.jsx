import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { navigate, BACKEND_URL, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [method, setMethod] = useState('cod');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData(data => ({ ...data, [name]: value }));
  };

  const initPay = order => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      // handler: async response => {
      //   try {
      //     const { data } = await axios.post(`${BACKEND_URL}/api/orders/verify-razorpay`, response, { withCredentials: true });
      //     if (data.success) {
      //       setCartItems({});
      //       navigate('/orders');
      //     }
      //   } catch (error) {
      //     console.log(error);
      //     toast.error(error.response.data.message);
      //   }
      // }
      handler: () => {
        setCartItems({})
        navigate('/orders')
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };

      switch (method) {
        // API calls for COD
        case 'cod':
          const response = await axios.post(`${BACKEND_URL}/api/orders/place-order`, orderData, { withCredentials: true });
          if (response.data.success) {
            setCartItems({});
            navigate('/orders');
          } else {
            toast.error(response.data.message);
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(`${BACKEND_URL}/api/orders/place-order-stripe`, orderData, { withCredentials: true });
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(responseStripe.data.message);
          }
          break;

        case 'razorpay':
          const responseRazorpay = await axios.post(`${BACKEND_URL}/api/orders/place-order-razorpay`, orderData, { withCredentials: true });
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* ------------------------ Left Side ------------------------- */}
      <div className="flex flex-col gap-4 w-full max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className="flex gap-3">
          <input onChange={handleChange} name="firstName" value={formData.firstName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="First Name" type="text" required />
          <input onChange={handleChange} name="lastName" value={formData.lastName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Last Name" type="text" required />
        </div>
        <input onChange={handleChange} name="email" value={formData.email} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Email Address" type="email" required />
        <input onChange={handleChange} name="street" value={formData.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Street" type="text" required />
        <div className="flex gap-3">
          <input onChange={handleChange} name="city" value={formData.city} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="City" type="text" required />
          <input onChange={handleChange} name="state" value={formData.state} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="State" type="text" required />
        </div>
        <div className="flex gap-3">
          <input onChange={handleChange} name="zipcode" value={formData.zipcode} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Zipcode" type="number" required />
          <input onChange={handleChange} name="country" value={formData.country} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Country" type="text" required />
        </div>
        <input onChange={handleChange} name="phone" value={formData.phone} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Phone" type="number" required />
      </div>

      {/* ------------------------ Right Side ------------------------- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* ---------- Payment Method Selection ------------- */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === `stripe` ? 'bg-green-400' : ''}`}></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === `razorpay` ? 'bg-green-400' : ''}`}></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === `cod` ? 'bg-green-400' : ''}`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
          </div>

          {/* Button */}
          <div className="w-full text-end mt-8">
            <button type="submit" className="bg-black text-white px-16 py-3 text-sm cursor-pointer">
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
