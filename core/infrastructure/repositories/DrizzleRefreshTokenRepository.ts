import { RefreshTokenRepository, RefreshToken } from '@/core/application/ports/RefreshTokenRepository.ts';
import { db, schema } from '@/infra/database/client.ts';
import { eq } from 'drizzle-orm';

export class DrizzleRefreshTokenRepository implements RefreshTokenRepository {
  async save(token: RefreshToken): Promise<void> {
    const dbToken = {
      ...token,
      revoked: token.revoked ? 1 : 0
    };
    await db.insert(schema.refreshTokens)
      .values(dbToken)
      .onConflictDoUpdate({ target: schema.refreshTokens.id, set: dbToken });
  }

  async findByTokenHash(hash: string): Promise<RefreshToken | null> {
    const result = await db.query.refreshTokens.findFirst({
      where: eq(schema.refreshTokens.tokenHash, hash)
    });
    
    if (!result) return null;
    
    return {
      ...result,
      revoked: result.revoked === 1
    };
  }

  async revoke(id: string): Promise<void> {
    await db.update(schema.refreshTokens)
      .set({ revoked: 1 })
      .where(eq(schema.refreshTokens.id, id));
  }
}
