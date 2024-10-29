/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'example.com',
      'cdn.example.com',
      'images.example.com',
      'fakestoreapi.com', // Add this line
      'images.pexels.com',
      'cdn.jsdelivr.net',
      'via.placeholder.com',
      '*', // Allow all domains (not recommended for production)
    ],
  },
};

export default nextConfig;
