/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'oneshotmanufacturing.in',
          },
        ],
        destination: 'https://oneshotmanufacturing.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.oneshotmanufacturing.in',
          },
        ],
        destination: 'https://oneshotmanufacturing.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
