/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for Cloudflare Workers
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Trailing slash for better static hosting
  trailingSlash: true,
};

export default nextConfig;
