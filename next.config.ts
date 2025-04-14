// @ts-check

import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  eslint: {
    // Desabilitar verificação de ESLint durante o build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Desabilitar verificação de TypeScript durante o build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
