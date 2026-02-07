import { TokenService } from '@/core/application/ports/TokenService.ts'

export class FakeTokenService implements TokenService {
  async sign(payload: Record<string, unknown>) {
    return `token_${JSON.stringify(payload)}`
  }

  async signRefreshToken(payload: Record<string, unknown>) {
    return `refresh_token_${JSON.stringify(payload)}`
  }

  async verify(token: string) {
    if (!token.startsWith('token_')) throw new Error('InvalidToken')
    return JSON.parse(token.replace('token_', ''))
  }

  async verifyRefreshToken(token: string) {
    if (!token.startsWith('refresh_token_')) throw new Error('InvalidToken')
    return JSON.parse(token.replace('refresh_token_', ''))
  }
}
