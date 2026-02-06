import { UserRepository } from '../ports/UserRepository.ts'
import { PasswordService } from '../ports/PasswordService.ts'
import { TokenService } from '../ports/TokenService.ts'
import { RefreshTokenRepository } from '../ports/RefreshTokenRepository.ts'
import { IdGenerator } from '../ports/IdGenerator.ts'

export class LoginUserUseCase {
  constructor(
    private repo: UserRepository,
    private passwordService: PasswordService,
    private tokenService: TokenService,
    private refreshTokenRepo: RefreshTokenRepository,
    private idGen: IdGenerator
  ) {}

  async execute(input: { email: string; password: string }): Promise<{ token: string; refreshToken: string }> {
    const user = await this.repo.findByEmail(input.email)
    if (!user) throw new Error('InvalidCredentials')

    const isValid = await this.passwordService.verify(input.password, user.passwordHash)
    if (!isValid) throw new Error('InvalidCredentials')

    const token = await this.tokenService.sign({ userId: user.id, email: user.email })

    // Refresh Token Logic
    const tokenId = this.idGen.generate();
    const refreshToken = await this.tokenService.signRefreshToken({ 
      userId: user.id, 
      tokenId 
    });

    // Hash it
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(refreshToken));
    const tokenHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.refreshTokenRepo.save({
      id: tokenId,
      userId: user.id,
      tokenHash,
      expiresAt,
      revoked: false
    });

    return { token, refreshToken }
  }
}
