'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/page'; // Adjust to your actual path
import { CircularProgress, Modal, Button } from '@mui/material';

const CheckoutPage: React.FC = () => {
  const { state } = useCart();
  const [billingInfo, setBillingInfo] = useState(() => {
    const savedInfo = localStorage.getItem('billingInfo');
    return savedInfo ? JSON.parse(savedInfo) : { name: '', email: '', address: '', city: '', zip: '' };
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [loadingCustomerDetails, setLoadingCustomerDetails] = useState(true); // New state to manage loading

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: 'some-user-id' }) // Replace with actual userId or relevant data
        });
        const data = await response.json();

        setBillingInfo({
          name: data.name || '',
          email: data.email || '',
          address: data.address || '',
          city: data.city || '',
          zip: data.zip || '',
        });
      } catch (error) {
        console.error('Error fetching customer details:', error);
      } finally {
        setLoadingCustomerDetails(false); // Mark loading as done
      }
    };

    fetchCustomerDetails();
  }, []);

  useEffect(() => {
    const orderTotal = state.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    
    setTotal(orderTotal);
  }, [state.items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedInfo = { ...billingInfo, [name]: value };
    setBillingInfo(updatedInfo);
    localStorage.setItem('billingInfo', JSON.stringify(updatedInfo));
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkoutapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          total,
          billingInfo,
        }),
      });

      const result = await response.json();
      console.log('Payment Response:', result);
      alert('Payment successful. Thank you for your purchase!');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Error processing payment.');
    } finally {
      setLoading(false);
      setModalOpen(false); // Close modal after processing
    }
  };

  return (
    <div className="checkout p-4 max-w-screen-lg mx-auto">
      <h1 className="text-3xl text-slate-600 font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="order-summary bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4 text-center">Order Summary</h2>
          <div className="space-y-4">
            {state.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img src={item.imageUrl || 'https://via.placeholder.com/50'} alt={item.name} className="w-10 h-10 object-cover" />
                  <div>
                    <h3 className="text-sm text-slate-400 font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.quantity} x KSh {item.price.toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-md text-green-700 font-semibold">KSh {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center font-semibold">
            <span className='text-lg text-slate-500'>Total</span>
            <span className='text-slate-400 font-bold text-xl'>KSh {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Billing Information */}
        <div className="billing-info bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-500 mb-4">Billing Information</h2>
          <form onSubmit={e => { e.preventDefault(); setModalOpen(true); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={billingInfo.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="p-3 border border-gray-300 rounded-lg text-slate-500 shadow-sm"
                required
              />
              <input
                type="email"
                name="email"
                value={billingInfo.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="p-3 border border-gray-300 text-slate-500 rounded-lg shadow-sm"
                required
              />
              <input
                type="text"
                name="address"
                value={billingInfo.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="p-3 border border-gray-300 text-slate-500 rounded-lg shadow-sm"
                required
              />
              <input
                type="text"
                name="city"
                value={billingInfo.city}
                onChange={handleInputChange}
                placeholder="City"
                className="p-3 border border-gray-300 text-slate-500 rounded-lg shadow-sm"
                required
              />
              <input
                type="text"
                name="zip"
                value={billingInfo.zip}
                onChange={handleInputChange}
                placeholder="Zip Code"
                className="p-3 border border-gray-300 text-slate-500 rounded-lg shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full mt-6 p-3 rounded-lg shadow-lg transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <CircularProgress size={24} color="inherit" />
                  <span className="ml-2">Processing...</span>
                </div>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="payment-modal-title"
        aria-describedby="payment-modal-description"
      >
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl mt-32 shadow-lg w-11/12 md:w-1/3 mx-auto">
          <h2 id="payment-modal-title" className="text-xl font-bold text-indigo-600 my-16 text-center">Confirm Payment</h2>
          <p id="payment-modal-description" className="mt-2 text-center">You are about to pay KSh {total.toFixed(2)}. Proceed?</p>
          <div className="flex space-x-4 mt-4">
            <Button onClick={handleConfirmPayment} color="primary" className="bg-blue-600 text-white">Confirm</Button>
            <Button onClick={() => setModalOpen(false)} color="secondary">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
