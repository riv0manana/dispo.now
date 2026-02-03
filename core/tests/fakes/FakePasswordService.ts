import { PasswordService } from '@/core/application/ports/PasswordService.ts'

export class FakePasswordService implements PasswordService {
  async hash(password: string) {
    return `hashed_${password}`
  }

  async verify(password: string, hash: string) {
    return hash === `hashed_${password}`
  }
}
