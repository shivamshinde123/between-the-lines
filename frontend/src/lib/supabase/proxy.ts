import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getPublicSupabaseEnv } from "@/lib/public-env";

const PUBLIC_PATHS = new Set(["/login", "/signup"]);

function isStaticAsset(pathname: string) {
  return pathname.startsWith("/_next");
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const { publishableKey, url } = getPublicSupabaseEnv();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, options, value }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data } = await supabase.auth.getClaims();

  const pathname = request.nextUrl.pathname;

  if (isStaticAsset(pathname)) {
    return response;
  }

  const isAuthenticated = Boolean(data?.claims?.sub);
  const isPublicPath = PUBLIC_PATHS.has(pathname);

  if (!isAuthenticated && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);

    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isPublicPath) {
    const libraryUrl = new URL("/", request.url);

    return NextResponse.redirect(libraryUrl);
  }

  return response;
}

