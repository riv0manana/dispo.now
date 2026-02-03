import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { CreateUserUseCase } from '@/core/application/usecases/CreateUserUseCase.ts'
import { FakeUserRepository } from '@/core/tests/fakes/FakeUserRepository.ts'
import { FakePasswordService } from '@/core/tests/fakes/FakePasswordService.ts'

Deno.test('creates user with hashed password', async () => {
  const repo = new FakeUserRepository()
  const passwordService = new FakePasswordService()
  const uc = new CreateUserUseCase(repo, { generate: () => 'u1' }, passwordService)

  const result = await uc.execute({ email: 'test@example.com', password: 'password123' })

  assertEquals(result.id, 'u1')
  assertEquals(result.email, 'test@example.com')

  const stored = await repo.findById('u1')
  assertEquals(stored?.passwordHash, 'hashed_password123')
})

Deno.test('fails if user already exists', async () => {
  const repo = new FakeUserRepository()
  const passwordService = new FakePasswordService()
  const uc = new CreateUserUseCase(repo, { generate: () => 'u1' }, passwordService)

  await repo.save({ id: 'existing', email: 'test@example.com', passwordHash: 'hash' })

  await assertRejects(
    () => uc.execute({ email: 'test@example.com', password: 'new' }),
    Error,
    'UserAlreadyExists'
  )
})
