/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [ 'images.unsplash.com', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'landing-page-linvxcode.vercel.app' ],
  },
};

module.exports = nextConfig;