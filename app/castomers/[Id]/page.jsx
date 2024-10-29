'use client';

import { notFound } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const fetchCustomer = async (id) => {
  const res = await fetch(`/api/customers/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch customer');
  }
  return res.json();
};

const CustomerPage = ({ params }) => {
  const { id } = params;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const customerData = await fetchCustomer(id);
        setCustomer(customerData);
      } catch (error) {
        console.error(error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Add a loading state
  }

  if (!customer) {
    return <div>No customer found.</div>; // Handle case where customer is not found
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Customer Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Name:</h2>
          <p className="text-lg">{customer.name}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Email:</h2>
          <p className="text-lg">{customer.email}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Phone Number:</h2>
          <p className="text-lg">{customer.phoneNumber}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Address:</h2>
          <p className="text-lg">{customer.address}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">User ID:</h2>
          <p className="text-lg">{customer.userId}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Role:</h2>
          <p className="text-lg">{customer.role}</p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default CustomerPage;
