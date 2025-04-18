/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    images: {
      domains: ['localhost', 'nestjs-backend-production-8163.up.railway.app'],
    },
  };
  
  module.exports = nextConfig;
  