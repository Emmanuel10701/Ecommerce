"use client";
import React, { useState, useEffect } from 'react';
import { FaCartPlus, FaCartArrowDown, FaArrowLeft, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import StarRating from '../../../components/star/page';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../../../context/page';
import Link from 'next/link';
import CircularProgress from '@mui/material/CircularProgress'; // Import MUI CircularProgress

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string;
  description?: string;
  ratings?: number;
  category?: string;
}

const ProductPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { state, dispatch } = useCart();
  const router = useRouter();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [processing, setProcessing] = useState<boolean>(false); // State for processing

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/actions/products/${id}`, { method: 'GET' });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data: Product = await response.json();
        setProduct(data);

        const relatedResponse = await fetch(`/actions/products?category=${data.category}`, { method: 'GET' });
        const relatedData: Product[] = await relatedResponse.json();
        
        const filteredRelatedProducts = relatedData.filter(item => item.id !== data.id);
        const shuffledRelatedProducts = filteredRelatedProducts.sort(() => 0.5 - Math.random());
        
        setRelatedProducts(shuffledRelatedProducts.slice(0, 4));
      } catch (err: any) {
        setError(`Failed to load product: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const isInCart = state.items.some(item => item.id === id);

  const handleAddToCart = () => {
    if (isInCart) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
    } else if (product) {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.image || '/images/default.avif', 
        },
      });
    }
  };

  const handleBackClick = () => {
    setProcessing(true); // Set processing state to true
    setTimeout(() => {
      router.push('/Productslistpage');
    }, 3000); // Navigate back after 2 seconds
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-t-blue-600 border-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!product) return null;

  const discountPercentage = product.oldPrice ? ((product.oldPrice - product.price) / product.oldPrice * 100).toFixed(0) : '';
  const fullDescription = product.description || '';

  return (
    <div className="container mx-auto p-4 mt-14 ">
      <div className="flex flex-col md:flex-row">
        <div className=" md:w-2/4 w-full flex flex-col items-center">
          <div className="relative w-3/4 h-2/3 flex  justify-center mb-4">
            <Image
              src={product.image || '/images/default.avif'}
              alt={`Image of ${product.name}`}
              width={300}
              height={300}
              layout="responsive"
              className="rounded-xl  "
            />
            {product.oldPrice && (
              <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-xl">
                -{discountPercentage}%
              </div>
            )}
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold text-indigo-400 mb-4">Related Products</h2>
            <div className="flex space-x-4 overflow-x-auto flex-wrap">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="w-1/4 min-w-[120px]  flex flex-wrap items-center">
                  <Link href={`/Productslistpage/${relatedProduct.id}`}>
                    <Image
                      src={relatedProduct.image || '/images/default.avif'}
                      alt={`Image of ${relatedProduct.name}`}
                      width={70}
                      height={70}
                      className="rounded-lg mb-2 "
                    />
                    <h3 className="text-sm font-bold text-center text-indigo-600">{relatedProduct.name}</h3>
                    <span className="text-sm">${relatedProduct.price.toFixed(2)}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/4 flex flex-col p-4">
          <h1 className="text-2xl font-bold text-indigo-600 mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <span className="text-xl font-semibold mr-2">ksh{product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="text-sm text-gray-500 line-through">ksh{product.oldPrice.toFixed(2)}</span>
            )}
          </div>
          {product.ratings && (
            <div className="mb-4">
              <StarRating rating={product.ratings} />
            </div>
          )}

          <div className="flex space-x-4 my-6">
              <Link href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                <FaFacebook size={24} />
              </Link>
              <Link href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="text-blue-400">
                <FaTwitter size={24} />
              </Link>
              <Link href={`https://instagram.com/share?url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="text-pink-600">
                <FaInstagram size={24} />
              </Link>
              <Link href={`https://linkedin.com/shareArticle?url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="text-blue-700">
                <FaLinkedin size={24} />
              </Link>
            </div>
          <p className="mb-4 text-sm md:text-md  text-slate-500 font-semibold">{fullDescription}</p>

          <div className="flex space-x-2 justify-evenly items-center mt-10">
            <button onClick={handleBackClick} className="flex items-center justify-center text-white bg-orange-600 rounded-lg px-4 flex-1 py-2">
              {processing ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  <span className="ml-2 text-center">Processing...</span>
                </>
              ) : (
                <span className="ml-1 text-center text-sm">Back</span>
              )}
            </button>

            <button
              onClick={handleAddToCart}
              className={`flex items-center text-sm justify-center py-2 px-3 flex-1 rounded-lg text-white transition-colors ${isInCart ? 'bg-blue-600' : 'bg-green-600'}`}
            >
              {isInCart ? (
                <>
                  <FaCartArrowDown size={16} className="mr-2 text-sm" />
                  In cart
                </>
              ) : (
                <>
                  <FaCartPlus size={16} className="mr-2 text-sm" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
