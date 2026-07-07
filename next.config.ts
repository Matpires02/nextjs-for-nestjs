import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
        search: '',
      },
      /* {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      }, */
    ],
  },
};

export default nextConfig;
