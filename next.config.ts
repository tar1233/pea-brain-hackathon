import type { NextConfig } from "next";
// @ts-ignore
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  env: {
    PEA_AWS_ACCESS_KEY_ID: process.env.PEA_AWS_ACCESS_KEY_ID,
    PEA_AWS_SECRET_ACCESS_KEY: process.env.PEA_AWS_SECRET_ACCESS_KEY,
  }
};

export default withPWA(nextConfig);
