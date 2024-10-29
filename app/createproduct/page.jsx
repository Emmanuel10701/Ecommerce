"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    oldPrice: undefined,
    ratings: undefined,
    image: null,
    quantity: undefined,
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === 'file') {
      if (files && files[0]) {
        const file = files[0];
        setFormData(prev => ({ ...prev, [name]: file }));
        setImagePreviewUrl(URL.createObjectURL(file));
      } else {
        setFormData(prev => ({ ...prev, [name]: null }));
        setImagePreviewUrl(null);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? (value ? parseFloat(value) : undefined) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (status === 'unauthenticated') {
      setShowLoginPrompt(true);
      setLoading(false);
      return;
    }

    if (session?.user?.role !== 'ADMIN') {
      setShowAccessDenied(true);
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', formData.price.toString());
      if (formData.oldPrice !== undefined) form.append('oldPrice', formData.oldPrice.toString());
      if (formData.ratings !== undefined) form.append('ratings', formData.ratings.toString());
      if (formData.image) form.append('image', formData.image);
      form.append('category', formData.category);
      if (formData.quantity !== undefined) form.append('quantity', formData.quantity.toString());

      const response = await axios.post('/actions/products', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        toast.success('Product created successfully!');
        setFormData({
          name: '',
          description: '',
          price: 0,
          oldPrice: undefined,
          ratings: undefined,
          image: null,
          quantity: undefined,
          category: "",
        });
        setImagePreviewUrl(null);
      } else {
        toast.error(response.data.error || 'Failed to create product.');
      }
    } catch (error) {
      console.error('Error creating product:', error.message || error);
      toast.error(error.response?.data?.error || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center min-h-screen p-6 bg-slate-100">
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Login Required</h2>
            <p className="mb-4">Please log in to add a product.</p>
            <button
              onClick={() => router.push('/login')}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-black transition-opacity duration-300"
            >
              Go to Login
            </button>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-black transition-opacity duration-300 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showAccessDenied && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Access Denied</h2>
            <p className="mb-4">You do not have permission to access this page.</p>
            <button
              onClick={() => setShowAccessDenied(false)}
              className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-black transition-opacity duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <form
        className="p-8 bg-white rounded-lg shadow-lg w-full max-w-4xl border border-gray-200"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl my-10 text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Create New Product
        </h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex-1 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex-1 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category (optional):</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select category</option>
              {["Accessories", "Groceries", "Fashions", "Home Appliances", "Kids"].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Old Price (optional):</label>
            <input
              type="number"
              name="oldPrice"
              value={formData.oldPrice !== undefined ? formData.oldPrice : ''}
              onChange={handleChange}
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex-1 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity In Stock (optional):</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity !== undefined ? formData.quantity : ''}
              onChange={handleChange}
              step="1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ratings (optional):</label>
            <select
              name="ratings"
              value={formData.ratings !== undefined ? formData.ratings : ''}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Image (optional):</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {imagePreviewUrl && (
              <div className="mt-4 relative w-full h-48">
                <Image 
                  src={imagePreviewUrl} 
                  alt="Image Preview" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-lg border border-gray-200" 
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-between space-x-4 mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 mb-2 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-black transition-opacity duration-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => router.push('/productstable')}
            className="flex-1 mb-2 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-black transition-opacity duration-300"
          >
            Dashboard
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 mb-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-black transition-opacity duration-300"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </section>
  );
};

export default CreateProduct;
