import { UserRepository } from '../ports/UserRepository.ts'
import { PasswordService } from '../ports/PasswordService.ts'
import { TokenService } from '../ports/TokenService.ts'

export class LoginUserUseCase {
  constructor(
    private repo: UserRepository,
    private passwordService: PasswordService,
    private tokenService: TokenService
  ) {}

  async execute(input: { email: string; password: string }): Promise<{ token: string }> {
    const user = await this.repo.findByEmail(input.email)
    if (!user) throw new Error('InvalidCredentials')

    const isValid = await this.passwordService.verify(input.password, user.passwordHash)
    if (!isValid) throw new Error('InvalidCredentials')

    const token = await this.tokenService.sign({ userId: user.id, email: user.email })
    return { token }
  }
}
