"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import Sidebar from '../../../components/sidebar/page'; // Ensure the correct path
import LoadingSpinner from '../../../components/spinner/page';

const UserDetail = () => {
  const { id } = useParams(); // Get user ID from URL
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch user details based on user ID
    if (id) {
      fetch(`/users/${id}.json`) // Adjust the path if necessary
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setUser(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setLoading(false);
        });
    }
  }, [id]);

  if (status === 'loading' || loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="mb-6">You need to log in or register to access this page.</p>
          <button 
            onClick={() => router.push("/login")} 
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 ml-64 p-4 bg-gray-100">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 p-2 text-blue-500 hover:text-blue-700"
        >
          <FaArrowLeft /> Back
        </button>

        {/* User Details */}
        {user ? (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full" />
              <div>
                <h1 className="text-2xl font-semibold">{user.name}</h1>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Role: {user.role}</p>
                <p className="text-gray-600">Date Joined: {new Date(user.dateJoined).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">User not found</p>
        )}
      </main>
    </div>
  );
};

export default UserDetail;
