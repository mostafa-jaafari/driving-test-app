import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        // Add the URL from your error log here:
        "glowing-spork-97667qx7746pfxgjw-3000.app.github.dev",
      ],
    },
  },
  reactCompiler: true,
  images: {
    domains: ["www.bing.com", "res.cloudinary.com"]
  }
};

export default nextConfig;