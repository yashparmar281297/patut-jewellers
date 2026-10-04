import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/**`),
    ],
  },
  experimental: {
    serverActions: {
      // Admin forms must also work when the site is shared through a VS Code dev tunnel.
      // The tunnel forwards the public host but rewrites Origin to the local address.
      allowedOrigins: ["*.devtunnels.ms", "localhost:3000", "localhost:3001", "localhost:3002"],
    },
  },
};

export default nextConfig;
