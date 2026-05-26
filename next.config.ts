import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
    },
    {
      protocol: "https",
      hostname: "img.wattpad.com",
    },
    {
      protocol: "https",
      hostname: "via.placeholder.com",
    },
  ],
},
};

export default nextConfig;
