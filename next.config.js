/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['res.cloudinary.com'], // ✅ add your host here
    },
  };
  
  module.exports = nextConfig;
  