import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.figma.com",
      },
      {
        // Figma Dev Mode MCP server — serves asset previews in local development.
        // Remove or restrict this pattern before deploying to production.
        protocol: "http",
        hostname: "localhost",
        port: "3845",
      },
    ],
  },
};

export default nextConfig;
