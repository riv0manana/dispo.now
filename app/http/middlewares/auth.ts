import { Context, Next } from 'hono';
import { container } from '@/container/index.ts';
import { TokenService } from '@/core/application/ports/TokenService.ts';

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const tokenService = container.get('TokenService') as TokenService;

  try {
    const payload = await tokenService.verify(token);
    c.set('user', payload);
    await next();
  } catch (e) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
};
