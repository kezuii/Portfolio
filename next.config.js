/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true, // Enable app directory support
    },
    webpack: (config) => {
      config.module.rules.push({
        test: /\.glsl$/,
        exclude: /node_modules/,
        use: 'raw-loader', // Alternatively, use glslify-loader if you want to process GLSL files
      });
  
      return config;
    },
  };
  
  module.exports = nextConfig;