export interface RefreshToken {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  revoked: boolean
}

export interface RefreshTokenRepository {
  save(token: RefreshToken): Promise<void>
  findByTokenHash(hash: string): Promise<RefreshToken | null>
  revoke(id: string): Promise<void>
}
