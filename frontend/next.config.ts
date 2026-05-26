import path from "node:path";
import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function getSupabaseRemotePattern(): RemotePattern | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!supabaseUrl) {
    return null;
  }

  try {
    const url = new URL(supabaseUrl);
    const protocol = url.protocol === "http:" ? "http" : url.protocol === "https:" ? "https" : null;

    if (!protocol) {
      return null;
    }

    return {
      hostname: url.hostname,
      pathname: "/storage/v1/object/sign/book-covers/**",
      protocol,
    };
  } catch {
    return null;
  }
}

const supabaseRemotePattern = getSupabaseRemotePattern();
const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: supabaseRemotePattern
    ? {
        remotePatterns: [supabaseRemotePattern],
      }
    : undefined,
  outputFileTracingRoot: path.join(__dirname, ".."),
  poweredByHeader: false,
  turbopack: {
    root: path.join(__dirname, ".."),
  },
};

export default nextConfig;
