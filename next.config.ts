/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        prerender: false, // Or list specific pages if Next.js supports it in your version
      },
};

module.exports = nextConfig;