"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Extract token from URL on the client side
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      toast.error('Token is missing');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        router.push('/login'); // Redirect to login after reset
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to reset password');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl mt-10 text-slate-700 font-extrabold mb-6 text-center">🛅 Reset Password</h2>

        <div className="relative mb-6">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            id="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`w-full p-3 border ${newPassword ? 'border-green-500' : 'border-gray-300'} rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-10 transform -translate-y-1/2 cursor-pointer">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="relative mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full p-3 border ${confirmPassword ? 'border-green-500' : 'border-gray-300'} rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-10 transform -translate-y-1/2 cursor-pointer">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className={`w-full py-3 bg-blue-500 text-white rounded-md ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <CircularProgress size={24} color="inherit" />
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordPage;
