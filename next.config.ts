import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Enable React strict mode for better error detection
    reactStrictMode: true,

    // Optimize images from CoinGecko
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "assets.coingecko.com",
            },
            {
                protocol: "https",
                hostname: "coin-images.coingecko.com",
            },
        ],
        formats: ["image/avif", "image/webp"], // Modern image formats
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60, // Cache images for 60 seconds
    },

    // Enable compression for better performance
    compress: true,

    // Add security headers
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    // Prevent clickjacking
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    // Prevent MIME type sniffing
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    // Enable XSS protection
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    // Referrer policy
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    // Permissions policy
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()",
                    },
                ],
            },
        ];
    },

    // Optimize production builds
    poweredByHeader: false, // Remove X-Powered-By header for security
};

export default nextConfig;
