import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const legacyServicePaths: Record<string, string> = {
  "/website-maintenance": "/services/website-maintenance",
  "/web-development": "/services/web-development",
  "/web-design": "/services/web-design",
  "/services/woocommerce-support": "/services/woocommerce-maintenance",
};

export function middleware(request: NextRequest) {
  const destinationPath = legacyServicePaths[request.nextUrl.pathname];

  if (!destinationPath) return NextResponse.next();

  const destination = request.nextUrl.clone();
  destination.pathname = destinationPath;

  return NextResponse.redirect(destination, 301);
}

export const config = {
  matcher: [
    "/website-maintenance",
    "/web-development",
    "/web-design",
    "/services/woocommerce-support",
  ],
};
