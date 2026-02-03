import { UserRepository } from '../ports/UserRepository.ts'
import { IdGenerator } from '../ports/IdGenerator.ts'
import { PasswordService } from '../ports/PasswordService.ts'
import { UserSchema } from '../../domain/user/User.schema.ts'

export class CreateUserUseCase {
  constructor(
    private repo: UserRepository,
    private idGen: IdGenerator,
    private passwordService: PasswordService
  ) {}

  async execute(input: { email: string; password: string }): Promise<{ id: string; email: string }> {
    const existing = await this.repo.findByEmail(input.email)
    if (existing) throw new Error('UserAlreadyExists')

    const passwordHash = await this.passwordService.hash(input.password)
    const user = UserSchema.parse({
      id: this.idGen.generate(),
      email: input.email,
      passwordHash
    })

    await this.repo.save(user)
    return { id: user.id, email: user.email }
  }
}
