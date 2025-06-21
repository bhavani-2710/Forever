import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = ({ authenticated, setAuthenticated }) => {
  const [currentState, setCurrentState] = useState('Login');
  const { navigate, BACKEND_URL } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        // SIGN UP
        const response = await axios.post(`${BACKEND_URL}/api/users/register`, { name, email, password }, { withCredentials: true });
        if (response.data.success) {
          setAuthenticated(true);
        } else {
          toast.error(response.data.message);
        }
      } else {
        // LOGIN
        const response = await axios.post(`${BACKEND_URL}/api/users/login`, { email, password }, { withCredentials: true });
        if (response.data.success) {
          setAuthenticated(true);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated]);

  return (
    <form className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/*  Input Fields */}
      {currentState === 'Login' ? '' : <input onChange={e => setName(e.target.value)} value={name} type="text" className="w-full px-3 py-2 border border-gray-800" placeholder="Name" required />}
      <input onChange={e => setEmail(e.target.value)} value={email} type="email" className="w-full px-3 py-2 border border-gray-800" placeholder="Email" required />
      <input onChange={e => setPassword(e.target.value)} value={password} type="password" className="w-full px-3 py-2 border border-gray-800" placeholder="Password" required />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === 'Login' ? (
          <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">
            Create account
          </p>
        ) : (
          <p onClick={() => setCurrentState('Login')} className="cursor-pointer">
            Login here
          </p>
        )}
      </div>
      <button onClick={handleSubmit} className="cursor-pointer bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;
