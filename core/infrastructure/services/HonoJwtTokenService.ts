import { TokenService } from '@/core/application/ports/TokenService.ts';
import { sign, verify } from 'hono/jwt';

const SECRET = Deno.env.get('JWT_SECRET')!;
if (!SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const REFRESH_TOKEN_EXPIRY_SEC = 7 * 24 * 60 * 60; // 7 days

export class HonoJwtTokenService implements TokenService {
  async sign(payload: Record<string, unknown>): Promise<string> {
    const expiresIn = Math.floor(Date.now() / 1000) + (15 * 60); // 15 minutes from now
    return sign({ ...payload, exp: expiresIn, type: 'access' }, SECRET, 'HS256');
  }

  async signRefreshToken(payload: Record<string, unknown>): Promise<string> {
    const expiresIn = Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRY_SEC;
    return sign({ ...payload, exp: expiresIn, type: 'refresh' }, SECRET, 'HS256');
  }

  async verify(token: string): Promise<Record<string, unknown>> {
    try {
      const payload = await verify(token, SECRET, 'HS256');
      
      // Check expiration
      if (payload.exp && typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('TokenExpired');
      }
      if (payload.type && payload.type !== 'access') {
        throw new Error('InvalidToken');
      }
      
      return payload;
    } catch (error: any) {
      if (error.message === 'TokenExpired') {
        throw new Error('TokenExpired');
      }
      throw new Error('InvalidToken');
    }
  }

  async verifyRefreshToken(token: string): Promise<Record<string, unknown>> {
    try {
      const payload = await verify(token, SECRET, 'HS256');
      
      if (payload.exp && typeof payload.exp === 'number' && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error('TokenExpired');
      }
      if (payload.type && payload.type !== 'refresh') {
        throw new Error('InvalidToken');
      }
      
      return payload;
    } catch (error: any) {
      if (error.message === 'TokenExpired') {
        throw new Error('TokenExpired');
      }
      throw new Error('InvalidToken');
    }
  }
}
