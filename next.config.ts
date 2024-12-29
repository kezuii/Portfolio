import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.glsl$/,
      use: "glslify-loader",
    });
    return config;
  },
};

export default nextConfig;
