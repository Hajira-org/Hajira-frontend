/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true, // only this is allowed
  },
};

module.exports = nextConfig;
