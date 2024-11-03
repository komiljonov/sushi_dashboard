/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["api.yummy.sectorsoft.uz"],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '8000',
                pathname: '/media/**'
            },
            {
                protocol: 'https',
                hostname: 'api.yummy.sectorsoft.uz',
                port: "443",
                pathname: '/media/**'
            },
            {
                protocol: 'http',
                hostname: 'api.yummy.sectorsoft.uz',
                port: "80",
                pathname: '/media/**'
            }
        ]
    }
};

export default nextConfig;
