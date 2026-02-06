import { RefreshTokenRepository, RefreshToken } from '@/core/application/ports/RefreshTokenRepository.ts';

export class FakeRefreshTokenRepository implements RefreshTokenRepository {
  private tokens = new Map<string, RefreshToken>();

  async save(token: RefreshToken): Promise<void> {
    this.tokens.set(token.id, token);
  }

  async findByTokenHash(hash: string): Promise<RefreshToken | null> {
    for (const token of this.tokens.values()) {
      if (token.tokenHash === hash) {
        return token;
      }
    }
    return null;
  }

  async revoke(id: string): Promise<void> {
    const token = this.tokens.get(id);
    if (token) {
      token.revoked = true;
      this.tokens.set(id, token);
    }
  }

  clear() {
    this.tokens.clear();
  }
}
