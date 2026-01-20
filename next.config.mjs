/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Security headers (additional to middleware)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    // Suppress case-sensitive path warnings on Windows
    config.infrastructureLogging = {
      level: 'error',
    };
    
    // Ignore case-sensitivity warnings
    const originalFilterWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings = [
      ...originalFilterWarnings,
      /There are multiple modules with names that only differ in casing/,
    ];
    
    return config;
  },
}

export default nextConfig
