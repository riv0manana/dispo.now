import { Context, Next } from 'hono'

export const securityHeaders = async (c: Context, next: Next) => {
  await next()

  if (Deno.env.get("NODE_ENV") === "production") {
    c.header("X-Content-Type-Options", "nosniff")
    c.header("X-Frame-Options", "DENY")
    c.header("X-XSS-Protection", "1; mode=block")
    c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    c.header("Referrer-Policy", "strict-origin-when-cross-origin")
    c.header(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'"
    )
    c.header("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
  }
}
