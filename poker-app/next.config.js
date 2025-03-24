/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Désactiver ESLint pendant la construction
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Désactiver la vérification TypeScript pendant la construction
    ignoreBuildErrors: true,
  },
  output: 'export',
  // Désactiver l'image optimization car elle n'est pas compatible avec le mode export statique
  images: {
    unoptimized: true,
  },
  // Désactiver les routes API en mode statique
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
