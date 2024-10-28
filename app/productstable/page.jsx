"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../components/paginationP/page';
import Sidebar from '../../components/sidebar/page';
import { useSession } from 'next-auth/react';
import { AiOutlineLogin } from "react-icons/ai";
import { useRouter } from 'next/navigation';
import { FaSync } from 'react-icons/fa';
import StarRating from '../../components/starRating/page';
import CircularProgress from '@mui/material/CircularProgress';

const ListProducts = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAccessDeniedModalOpen, setIsAccessDeniedModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const pageSize = 10;
  const DEFAULT_IMAGE = '/images/default.avif';

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (!session) {
      setLoading(false);
      return;
    }

    setLoading(false);
    fetchProducts();
  }, [session, status]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/actions/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch products.');
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await axios.delete(`/actions/products/${selectedProduct.id}`);
        toast.success('Product deleted successfully!');
        fetchProducts(); // Refresh product list
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete product.');
      } finally {
        setIsDeleteModalOpen(false);
      }
    }
  };

  const handleOpenModal = (type, productId) => {
    if (type === 'view' && (session?.user)?.role !== 'ADMIN') {
      setIsAccessDeniedModalOpen(true);
      return;
    }

    if (productId) {
      const product = products.find(p => p.id === productId);
      setSelectedProduct(product || null);
    }

    if (type === 'view') {
      setIsViewModalOpen(true);
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);
    setIsAccessDeniedModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    setFilteredProducts(filtered);
  }, [searchTerm, products, selectedCategory]);

  const isAdmin = session?.user?.role === 'ADMIN';

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100"><CircularProgress /></div>;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Please Log In
          </h2>
          <p className="mb-6 text-l font-semibold text-center">You need to log in or register to access this page.</p>
          <div className='flex justify-center items-center'>
            <div className='flex items-center'>
              <button 
                onClick={() => router.push("/login")} 
                className="flex items-center justify-center bg-slate-200 hover:bg-slate-300 border focus:outline-emerald-300 text-slate-500 py-2 px-4 rounded-full transition duration-300"
              >
                <AiOutlineLogin className="mr-2" /> Go to Login Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex px-4 md:px-8 py-4">
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => router.push('/createproduct')}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Add Product
            </button>
            <button
              onClick={() => {
                setIsRefreshing(true);
                fetchProducts().then(() => setIsRefreshing(false));
              }}
              className="bg-gray-500 flex text-white py-2 px-4 rounded hover:bg-gray-600"
              disabled={isRefreshing}
            >
              {isRefreshing ? <CircularProgress size={24} /> : <FaSync className="mr-2" />} Refresh
            </button>
            <button
              onClick={() => { router.push("analytics") }}
              className="bg-transparent rounded-full flex border text-slate-600 py-2 px-6 shadow-md md:shadow-lg hover:bg-slate-300"
            >
              Admin
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="ml-4 p-2 shadow-md border border-gray-300 rounded"
            />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="ml-4 p-2 border border-gray-300 rounded"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Groceries">Groceries</option>
              <option value="Fashions">Fashions</option>
              <option value="Home Appliances">Home Appliances</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <CircularProgress />
            </div>
          ) : (
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Image</th>
                  <th className="border border-gray-300 p-2">Name</th>
                  <th className="border border-gray-300 p-2">Price</th>
                  <th className="border border-gray-300 p-2">Quantity</th>
                  <th className="border border-gray-300 p-2">Rating</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4">No products found</td>
                  </tr>
                ) : (
                  filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(product => (
                    <tr key={product.id}>
                      <td className="border border-gray-300 p-2">
                        <img src={product.image || DEFAULT_IMAGE} alt={product.name} className="w-14 h-14 object-cover rounded-lg" />
                      </td>
                      <td className="border border-gray-300 p-2">{product.name}</td>
                      <td className="border border-gray-300 p-2">ksh{product.price.toFixed(2)}</td>
                      <td className="border border-gray-300 p-2">{product.quantity}</td>
                      <td className="border border-gray-300 p-2 text-yellow-600">
                        <StarRating rating={product.starRating} />
                      </td>
                      <td className="border border-gray-300 p-2">
                        <button
                          onClick={() => handleOpenModal('view', product.id)}
                          className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                        >
                          View
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleOpenModal('delete', product.id)}
                            className="bg-red-500 text-white py-1 px-2 rounded ml-2 hover:bg-red-600"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredProducts.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <ToastContainer />

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={handleCloseModals}
            >
              &times;
            </button>
            <h2 className="text-2xl mb-4">Delete Product</h2>
            <p>Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDeleteProduct}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={handleCloseModals}
                className="bg-gray-500 text-white py-2 px-4 rounded ml-2 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={handleCloseModals}
            >
              &times;
            </button>
            <h2 className="text-2xl mb-4">View Product</h2>
            <p><strong>Name:</strong> {selectedProduct?.name}</p>
            <p><strong>Description:</strong> {selectedProduct?.description}</p>
            <p><strong>Price:</strong> ${selectedProduct?.price?.toFixed(2)}</p>
            <p><strong>Quantity:</strong> {selectedProduct?.quantity}</p>
            <img src={selectedProduct?.image} alt={selectedProduct?.name} className="w-full h-auto mb-4 rounded-lg" />
            <button
              onClick={handleCloseModals}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Access Denied Modal */}
      {isAccessDeniedModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setIsAccessDeniedModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">Access Denied</h2>
            <p className="text-gray-700 text-center mb-6">You do not have permission to view this product.</p>
            <button
              onClick={() => setIsAccessDeniedModalOpen(false)}
              className="bg-gray-500 text-white py-2 px-6 rounded-full hover:bg-gray-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ListProducts;
