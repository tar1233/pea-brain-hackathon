import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  env: {
    PEA_AWS_ACCESS_KEY_ID: process.env.PEA_AWS_ACCESS_KEY_ID,
    PEA_AWS_SECRET_ACCESS_KEY: process.env.PEA_AWS_SECRET_ACCESS_KEY,
  }
};

export default nextConfig;
