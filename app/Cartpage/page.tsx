'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/page'; // Adjust this path to your actual context path
import Image from 'next/image';
import { CircularProgress, Button } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'; // Icon example

// Helper function to format prices
const formatPrice = (price: number): string => {
  const priceStr = price.toFixed(2).toString();
  const [integerPart, decimalPart] = priceStr.split('.');
  const integerPartWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${integerPartWithCommas}.${decimalPart}`;
};

const CartPage: React.FC = () => {
  const router = useRouter();
  const { state, dispatch } = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    setIsLoading(true);
    // Simulate a delay to show loading indicator
    setTimeout(() => {
      router.push('/checkout');
    }, 1000);
  };

  return (
    <div className="cart p-4 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-500 text-center">Shopping Cart</h1>

      {state.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-none p-4 my-[10%]">
          <p className="text-center text-slate-500 text-md mb-4">Your cart is empty</p>

          {/* Transparent Button with Spinner on Click */}
          <Button
            variant="outlined"
            startIcon={isLoading ? <CircularProgress size={20} /> : <ShoppingCartOutlinedIcon />}
            onClick={() => router.push('/Productslistpage')}
            disabled={isLoading}
            sx={{
              borderColor: 'blue',
              color: 'blue',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
              },
            }}
          >
            {isLoading ? 'Processing...' : 'Go to Products'}
          </Button>

          {/* Add more content beneath the empty cart */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Discover our amazing collection of products that suit your needs. Add items to your cart and proceed to checkout when ready!
            </p>
            <p className="text-sm text-gray-600 mt-2">
              For support, visit our <span className="text-blue-500 cursor-pointer">Help Center</span>.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="w-full max-w-4xl mx-auto">
            <table className="min-w-full divide-y divide-gray-300 shadow-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs md:text-md font-bold text-gray-600 uppercase tracking-wider">Image</th>
                  <th className="px-4 py-3 text-left text-xs md:text-md font-bold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-left text-xs md:text-md font-bold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs md:text-md font-bold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs md:text-md font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-center">
                      <Image
                        src={item.imageUrl || '/images/placeholder.jpg'}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg mx-auto"
                        onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                        className="p-1 text-lg font-bold text-center text-slate-600 w-16 rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 font-semibold">ksk{formatPrice(item.price)}</td>
                    <td className="px-4 py-3 text-center text-green-600 font-bold">ksh{formatPrice(item.price * item.quantity)}</td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveItem(item.id)}
                        sx={{
                          borderColor: 'red',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                          },
                        }}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {state.items.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
          {/* Proceed to Checkout Button */}
          <Button
            variant="outlined"
            onClick={handleProceedToCheckout}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
            sx={{
              borderColor: 'blue',
              color: 'blue',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
              },
            }}
          >
            {isLoading ? 'Proceeding...' : 'Proceed to Checkout'}
          </Button>

          <h2 className="text-lg sm:text-xl text-slate-500 font-extrabold mt-4 sm:mt-0">Total: ksh{formatPrice(total)}</h2>
        </div>
      )}
    </div>
  );
};

export default CartPage;
