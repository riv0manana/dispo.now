import { UserRepository } from '@/core/application/ports/UserRepository.ts'
import { User } from '@/core/domain/user/User.schema.ts'

export class FakeUserRepository implements UserRepository {
  private items: User[] = []

  async save(user: User) {
    this.items = this.items.filter(u => u.id !== user.id)
    this.items.push(user)
  }

  async findById(id: string) {
    return this.items.find(u => u.id === id) ?? null
  }

  async findByEmail(email: string) {
    return this.items.find(u => u.email === email) ?? null
  }
}
