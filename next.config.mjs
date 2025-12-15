/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Cloudflare Workers with custom API handler
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
};

export default nextConfig;
