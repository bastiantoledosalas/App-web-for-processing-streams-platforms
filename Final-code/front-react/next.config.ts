import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  //https://avatars.githubusercontent.com/u/7093454?v=4
  //https://ui-avatars.com/api/?name=John+Doe
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
};

export default nextConfig;
