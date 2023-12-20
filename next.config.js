/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: { domains: ["firebasestorage.googleapis.com"] },
  devIndicators: {},
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
    currency: "USD",
  },
  env: {
    SITE_URL: process.env.SITE_URL,
    API_URL: process.env.API_URL,
  },
  experimental: {
    esmExternals: true,
    i18n: {
      localeDetection: true,
    },
  }
};
module.exports = nextConfig;
