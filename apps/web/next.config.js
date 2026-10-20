/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  devIndicators: false,
  async rewrites() {
    const apiUrl = process.env.API_URL || 'http://127.0.0.1:7777';
    return [{ source: '/api/:path*', destination: `${apiUrl}/:path*` }];
  },
  async redirects() {
    return ['architecture', 'home', 'decor', 'toys', 'animals', 'games'].map(
      (category) => ({
        source: `/${category}`,
        destination: `/categories/${category}`,
        permanent: true,
      }),
    );
  },
};
