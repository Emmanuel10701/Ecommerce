// app/customers/[id]/page.tsx

import { notFound } from 'next/navigation';
import React from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  userId: string;
  role: string;
}

const fetchCustomer = async (id: string): Promise<Customer> => {
  const res = await fetch(`http://localhost:3000/api/castomers/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch customer');
  }
  return res.json();
};

const CustomerPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const customer = await fetchCustomer(id);

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
  } catch (error) {
    notFound();
  }
};

export default CustomerPage;
