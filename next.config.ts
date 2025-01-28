import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverActions: {
    bodySizeLimit: '100mb' // Set desired value here
  }
};

export default nextConfig;
