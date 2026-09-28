/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow local production verification without overwriting a running dev server.
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  trailingSlash: false,
  experimental: {
    outputFileTracingIncludes: {
      "/*": ["./src/generated/prisma/**/*"],
    },
  },
  async redirects() {
    return [{
      source: "/:path*",
      has: [{ type: "host", value: "www.izies.in" }],
      destination: "https://izies.in/:path*",
      permanent: true,
    }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://playaura-work.vercel.app" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, secret" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
