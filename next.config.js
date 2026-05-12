/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "www.mon-compteur.fr",
      },
    ],
  },
};

module.exports = nextConfig;
