/** @todo on production builds extract version number from package.json, else use commit SHA. */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_CLIENT_APP_BASE_URL: process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL,
  },
};

module.exports = nextConfig;
