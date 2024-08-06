/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https://*.clerk.com https://*.clerk.dev https://*.clerk.accounts.dev; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.com https://*.clerk.dev https://*.clerk.accounts.dev https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://*.clerk.com https://*.clerk.dev https://*.clerk.accounts.dev; img-src 'self' data: https: blob:; connect-src 'self' https://*.clerk.com https://*.clerk.dev https://*.clerk.accounts.dev https://api.ipify.org; frame-src 'self' https://*.clerk.com https://*.clerk.dev https://*.clerk.accounts.dev https://accounts.google.com; font-src 'self' https://fonts.gstatic.com; object-src 'none';"
          },
          // {
          //   key: 'Content-Security-Policy',
          //   value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
