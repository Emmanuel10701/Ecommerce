"use client";
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Import success and error icons

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false); // State for error handling

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email address.');
      setIsError(true); // Set error state
      return;
    }
    setLoading(true);
    setMessage(''); // Clear previous messages
    setIsError(false); // Reset error state
    try {
      await axios.post('/api/forgot', { email }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage('Password reset email sent. Please check your inbox.');
      setIsError(false); // Set success state
      setTimeout(() => setMessage(''), 4000); // Clear message after 4 seconds
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setMessage('Error sending password reset email.');
      setIsError(true); // Set error state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 transition-opacity duration-300 ${loading ? 'bg-gray-200 opacity-70' : 'bg-gray-200'}`}>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Forgot Your Password?</h2>
        <p className="text-gray-600 mb-6">Enter your email to receive a password reset link.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              placeholder="you@example.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !isValidEmail(email)}
            className={`w-full py-3 rounded-lg text-white transition duration-150 ease-in-out ${loading || !isValidEmail(email) ? 'bg-blue-500 opacity-60 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12c0-1.6.4-3.1 1-4.4l3.3 3.3-3.3 3.3C4.4 13.1 4 11.6 4 12zm16 0c0 1.6-.4 3.1-1 4.4l-3.3-3.3 3.3-3.3c.6 1.3 1 2.8 1 4.4z"></path>
                </svg>
                Sending...
              </span>
            ) : 'Send Reset Link'}
          </button>
          {message && (
            <p className={`mt-4 text-center flex items-center justify-center ${isError ? 'text-red-600' : 'text-green-600'}`}>
              {isError ? (
                <FaTimesCircle className="mr-2 w-6 h-6" /> // Error icon
              ) : (
                <FaCheckCircle className="mr-2 w-6 h-6" /> // Success icon
              )}
              {message}
            </p>
          )}
        </form>
        <p className="mt-4 text-center text-gray-600">
          Remembered your password? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
