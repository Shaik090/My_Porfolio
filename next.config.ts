import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep production builds from overwriting a running development server's assets.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: { qualities: [75, 90, 95] },
};
export default nextConfig;
