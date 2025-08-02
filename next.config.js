/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'spoonacular.com',
        port: '',
        pathname: '/recipeImages/**',
      }
    ],
  },
  experimental: {
    forceSwcTransforms: true,
  }
}

module.exports = nextConfig
