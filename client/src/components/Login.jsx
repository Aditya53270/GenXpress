import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets.js';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [mode, setMode] = useState('Login');
  const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);
  // Force reload to clear cache

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = backendUrl || 'http://localhost:4000';
      if (mode === 'login') {
        const { data } = await axios.post(apiUrl+ '/api/user/login', { email, password });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          setShowLogin(false);
          toast.success('Login successful!');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(apiUrl+ '/api/user/register', { name, email, password });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('token', data.token);
          setShowLogin(false);
          toast.success('Registration successful!');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='relative bg-white p-10 rounded-xl text-slate-600 w-full max-w-md'
      >
        <h1 className='text-center text-2xl text-neutral-700 font-medium capitalize'>{mode}</h1>
        <p className='text-sm text-gray-500 mt-1'>Welcome back, please sign in to continue</p>

        {mode !== 'login' && (
          <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
            <img src={assets.profile_icon} alt='' className='w-5 h-5' />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type='text'
              className='outline-none text-sm flex-1'
              placeholder='Full Name'
              required
            />
          </div>
        )}

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
          <img src={assets.email_icon} alt='' className='w-5 h-5' />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type='email'
            className='outline-none text-sm flex-1'
            placeholder='Email'
            required
          />
        </div>

        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
          <img src={assets.lock_icon} alt='' className='w-5 h-5' />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type='password'
            className='outline-none text-sm flex-1'
            placeholder='Password'
            required
          />
        </div>

        <button type='submit' className='mt-6 w-full bg-black text-white py-2 rounded-full'>
          {mode === 'login' ? 'Login' : 'Create account'}
        </button>

        <div className='text-center text-sm mt-4'>
          {mode === 'login' ? (
            <span>
              New here?{' '}
              <button type='button' onClick={() => setMode ('register')} className='text-blue-600'>
                Create an account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button type='button' onClick={() => setMode('login')} className='text-blue-600'>
                Login
              </button>
            </span>
          )}
        </div>
      </motion.form>
    </div>
    );
  };
  export default Login;