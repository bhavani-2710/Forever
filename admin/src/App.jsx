import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const CURRENCY = '₹';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/check-admin-auth`, {
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
  }, [authenticated]);

  return (
    <div>
      <ToastContainer />
      {loading ? (
        <div>Loading...</div>
      ) : authenticated ? (
        <>
          <Navbar setAuthenticated={setAuthenticated} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[70%] mx-uto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<List authenticated={authenticated} />} />
                <Route path="/add" element={<Add authenticated={authenticated} />} />
                <Route path="/orders" element={<Orders authenticated={authenticated} />} />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Login setAuthenticated={setAuthenticated} />
      )}
    </div>
  );
};

export default App;
