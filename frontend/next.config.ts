import path from "node:path";
import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : null;

const nextConfig: NextConfig = {
  images: supabaseHostname
    ? {
        remotePatterns: [
          {
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/sign/book-covers/**",
            protocol: "https",
          },
        ],
      }
    : undefined,
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
