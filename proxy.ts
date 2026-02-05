import createMiddleware from "next-intl/middleware"

const intlMiddleware = createMiddleware({
  locales: ["en", "fr"],
  defaultLocale: "en",
})

// Next.js 16 proxy convention: export a single default `proxy(request)`
export default function proxy(request: Request) {
  return intlMiddleware(request as any)
}

export const config = {
  // Exclude api, _next, _vercel and any file with an extension (e.g., .jpg, .css)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}