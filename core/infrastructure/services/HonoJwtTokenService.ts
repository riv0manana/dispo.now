import { TokenService } from '@/core/application/ports/TokenService.ts';
import { sign, verify } from 'hono/jwt';

const SECRET = Deno.env.get('JWT_SECRET') || 'secret';

export class HonoJwtTokenService implements TokenService {
  async sign(payload: Record<string, unknown>): Promise<string> {
    return sign(payload, SECRET, 'HS256');
  }

  async verify(token: string): Promise<Record<string, unknown>> {
    return verify(token, SECRET, 'HS256');
  }
}
