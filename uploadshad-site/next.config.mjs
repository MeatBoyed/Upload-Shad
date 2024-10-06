import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "uploadshad/introduction",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dstilezauto.s3.af-south-1.amazonaws.com",
        port: "",
      },
    ],
  },
};

// module.exports = withContentlayer(nextConfig);
export default withContentlayer(nextConfig);
