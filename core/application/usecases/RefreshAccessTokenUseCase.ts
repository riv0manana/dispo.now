import { TokenService } from '../ports/TokenService.ts'
import { RefreshTokenRepository } from '../ports/RefreshTokenRepository.ts'
import { UserRepository } from '../ports/UserRepository.ts'
import { IdGenerator } from '../ports/IdGenerator.ts'

export class RefreshAccessTokenUseCase {
  constructor(
    private tokenService: TokenService,
    private refreshTokenRepo: RefreshTokenRepository,
    private userRepo: UserRepository,
    private idGen: IdGenerator
  ) {}

  async execute(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    // 1. Verify signature & structure
    let payload;
    try {
      payload = await this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new Error('InvalidRefreshToken');
    }

    // 2. Hash and lookup
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(refreshToken));
    const tokenHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    const storedToken = await this.refreshTokenRepo.findByTokenHash(tokenHash);
    
    // 3. Validation
    if (!storedToken) {
        throw new Error('InvalidRefreshToken'); 
    }

    if (storedToken.revoked) {
        throw new Error('RevokedRefreshToken');
    }

    if (storedToken.expiresAt < new Date()) {
        throw new Error('ExpiredRefreshToken');
    }

    if (storedToken.userId !== payload.userId) {
        throw new Error('InvalidRefreshToken');
    }

    // 4. Revoke used token (Rotation)
    await this.refreshTokenRepo.revoke(storedToken.id);

    // 5. Issue new tokens
    const user = await this.userRepo.findById(storedToken.userId);
    if (!user) throw new Error('UserNotFound');

    const newAccessToken = await this.tokenService.sign({ userId: user.id, email: user.email });
    
    const newTokenId = this.idGen.generate();
    const newRefreshToken = await this.tokenService.signRefreshToken({ 
      userId: user.id, 
      tokenId: newTokenId 
    });

    const newHashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(newRefreshToken));
    const newTokenHash = Array.from(new Uint8Array(newHashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.refreshTokenRepo.save({
      id: newTokenId,
      userId: user.id,
      tokenHash: newTokenHash,
      expiresAt,
      revoked: false
    });

    return { token: newAccessToken, refreshToken: newRefreshToken };
  }
}
