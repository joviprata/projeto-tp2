/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora erros de ESLint durante o build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de TypeScript durante o build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
