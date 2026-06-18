import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false, // Disabling Strict Mode is required for react-wordcloud (D3) to work in React 18+
};

export default nextConfig;
