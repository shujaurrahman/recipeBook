/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.spoonacular.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.spoonacular.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
