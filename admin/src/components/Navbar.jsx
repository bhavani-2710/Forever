import React from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../App';

const Navbar = ({ setAuthenticated }) => {
  const handleLogout = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/users/logout`, {
        withCredentials: true
      });
      toast.success(res.data.message);
      setAuthenticated(false); // update UI state
    } catch (err) {
      toast.error('Logout failed');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="" />
      <button onClick={handleLogout} className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer active:bg-black">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
