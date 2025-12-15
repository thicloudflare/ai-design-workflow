/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization for Cloudflare Workers
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
