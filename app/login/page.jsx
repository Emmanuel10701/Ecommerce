"use client";

import { FormEvent, useState, useEffect } from "react";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BiSolidShow, BiSolidHide } from 'react-icons/bi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress'; // Import MUI CircularProgress

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/productstable");
    }
  }, [status, router]);

  // Validate form fields
  useEffect(() => {
    setIsValid(data.email.trim() !== "" && data.password.trim() !== "");
  }, [data]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      toast.error("Both email and password are required.");
      return;
    }

    setIsSubmitting(true);
    
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.ok) {
      toast.success("Sign-in successful!");
      router.push("/analytics");
    } else {
      toast.error("Something went wrong. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/login.jpg')" }}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 md:p-12">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border-gray-300 rounded-md shadow-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-500 sm:text-sm"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full mt-1 p-3 border-gray-300 rounded-md shadow-lg focus:ring-4 focus:ring-blue-300 focus:border-blue-500 sm:text-sm pr-12"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <BiSolidHide size={20} /> : <BiSolidShow size={20} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="text-blue-500 text-sm hover:underline"
            onClick={() => router.push("/forgot")}
          >
            Forgot password?
          </button>

          <button
            type="submit"
            className={`w-full py-2 rounded-md text-lg transition ${
              isSubmitting
                ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
                : isValid
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-600 text-white opacity-60 cursor-not-allowed'
            }`}
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <CircularProgress size={24} className="mr-2" /> Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          <p className="text-center text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
