/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hp.widen.net",
      },
      {
        protocol: "https",
        hostname: "*.hp.com",
      },
      {
        protocol: "https",
        hostname: "ssl-product-images.www8-hp.com",
      },
    ],
  },
};

export default nextConfig;

