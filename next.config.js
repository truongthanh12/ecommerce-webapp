// const { i18n } = require("./next-i18next.config");
const nextConfig = {
  // i18n,
  devIndicators: {},
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
    currency: "USD",
  },
  api: {
    externalResolver: true,
  },
  env: {
    SITE_URL: process.env.SITE_URL,
    API_URL: process.env.API_URL,
  },
  experimental: {
    appDir: true,
  },
};
module.exports = nextConfig;
