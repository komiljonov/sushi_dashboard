/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        "api.yummy.sector-soft.ru",
        "1511-195-158-2-126.ngrok-free.app", // <-- Add this!
        '10.100.222.35:8000'
      ],
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '8000',
          pathname: '/media/**',
        },
        {
          protocol: 'http',
          hostname: '10.100.222.35',
          port: '8000',
          pathname: '/media/**',
        },
        {
          protocol: 'https',
          hostname: 'api.yummy.sector-soft.ru',
          port: '443',
          pathname: '/media/**',
        },
        {
          protocol: 'http',
          hostname: 'api.yummy.sector-soft.ru',
          port: '80',
          pathname: '/media/**',
        },
        {
          protocol: 'https',
          hostname: '1511-195-158-2-126.ngrok-free.app', // for ngrok
          pathname: '/media/**',
        },
      ],
      // experimental: {
      //   esmExternals: true,
      // },
    },
  };
  
  export default nextConfig;
  