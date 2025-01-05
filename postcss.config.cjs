export default {
  plugins: {
    autoprefixer: {},
  },
};

export const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    turbopack: true,
  },
};
