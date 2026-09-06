import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Podgląd w piaskownicy działa na hoście *.e2b.app - zezwalamy na obce originy
  // dla HMR, żeby dev serwer nie odrzucał połączenia websocket.
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
