import { Context, Next } from 'hono';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

const RATE_LIMIT_WINDOW = Number(Deno.env.get('RATE_LIMIT_WINDOW_MS') || '900000'); // 15 minutes
const isTest = Deno.env.get('NODE_ENV') === 'test';
const defaultMax = isTest ? 10000 : 100;
const RATE_LIMIT_MAX_REQUESTS = Number(Deno.env.get('RATE_LIMIT_MAX') || defaultMax);

export const rateLimitMiddleware = async (c: Context, next: Next) => {
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  const now = Date.now();
  
  const key = `rate_limit:${ip}`;
  const current = store.get(key);
  
  if (!current || now > current.resetTime) {
    // Reset or initialize
    store.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
  } else {
    // Increment counter
    current.count++;
    
    if (current.count > RATE_LIMIT_MAX_REQUESTS) {
      const retryAfter = Math.ceil((current.resetTime - now) / 1000);
      c.header('Retry-After', retryAfter.toString());
      c.header('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
      c.header('X-RateLimit-Remaining', '0');
      c.header('X-RateLimit-Reset', current.resetTime.toString());
      
      return c.json({ error: 'Rate limit exceeded' }, 429);
    }
  }
  
  // Set rate limit headers
  const currentData = store.get(key)!;
  c.header('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
  c.header('X-RateLimit-Remaining', (RATE_LIMIT_MAX_REQUESTS - currentData.count).toString());
  c.header('X-RateLimit-Reset', currentData.resetTime.toString());
  
  await next();
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    for (const [k, v] of store.entries()) {
      if (now > v.resetTime) {
        store.delete(k);
      }
    }
  }
};