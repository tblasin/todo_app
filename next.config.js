/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

// next.config.js

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'www.mon-compteur.fr',
      },
    ],
  },
};
