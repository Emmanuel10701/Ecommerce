"use client";

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BiSolidShow, BiSolidHide } from 'react-icons/bi';
import { CircularProgress } from '@mui/material'; // Import CircularProgress

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  // Validate form fields
  useEffect(() => {
    const { name, email, password } = data;
    setIsValid(name.trim() !== "" && email.trim() !== "" && password.trim() !== "");
  }, [data]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/register', data);

      if (response.status === 200 && response.data.success) {
        toast.success('User registered successfully!');
        router.push('/login');
      } else {
        // Handle specific errors from the server
        const responseData = response.data;
        toast.error(responseData.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Extract specific error messages from the response
        const responseData = error.response.data;
        toast.error(responseData.error || 'Registration failed. Please try again.');
      } else {
        // Handle unexpected errors
        console.error('Error during registration:', error);
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url('/assets/register.png')" }}
    >
      <form
        className="p-8 xs:p-10 w-full max-w-md mx-auto md:w-1/2 md:max-w-md flex flex-col items-center justify-center gap-6 rounded-lg bg-white shadow-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-6 text-4xl font-extrabold text-blue-800 text-center">Create Account</h1>

        <label className="w-full text-sm font-medium">Name:</label>
        <input
          type="text"
          placeholder="Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className="w-full h-12 border border-gray-300 py-2 px-4 rounded-lg bg-gray-100 text-sm"
          required
        />

        <label className="w-full text-sm font-medium">Email:</label>
        <input
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className="w-full h-12 border border-gray-300 py-2 px-4 rounded-lg bg-gray-100 text-sm"
          required
        />

        <label className="w-full text-sm font-medium">Password:</label>
        <div className="flex w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="w-full h-12 border border-gray-300 py-2 px-4 rounded-l-lg bg-gray-100 text-sm"
            required
          />
          <button
            type="button"
            className="w-12 border border-gray-300 bg-gray-100 rounded-r-lg flex items-center justify-center transition-colors duration-150 hover:bg-gray-200"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <BiSolidHide size={20} /> : <BiSolidShow size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-md transition-colors duration-150 ${
            isSubmitting
              ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
              : isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-slate-600 text-white opacity-60 cursor-not-allowed'
          } flex items-center justify-center`}
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Register'}
        </button>

        <p className="text-gray-600 text-sm mt-4 text-center">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Sign In</a>
        </p>
      </form>

      <ToastContainer />
    </section>
  );
};

export default Register;
