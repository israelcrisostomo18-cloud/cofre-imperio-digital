import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/checkout", destination: "/", permanent: false },
      { source: "/oferta", destination: "/", permanent: false }
    ];
  }
};

export default nextConfig;
