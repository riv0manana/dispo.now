import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeUserRepository } from '@/core/tests/fakes/FakeUserRepository.ts'

Deno.test('creates user with hashed password', async () => {
  const repo = loadDeps('UserRepository') as FakeUserRepository
  const uc = loadDeps('CreateUserUseCase')
  
  repo.clear()

  const result = await uc.execute({ email: 'test@example.com', password: 'password123' })

  // Container mock generator returns 'test@example.com'
  assertEquals(result.email, 'test@example.com')

  const stored = await repo.findById(result.id)
  assertEquals(stored?.passwordHash, 'hashed_password123')
})

Deno.test('fails if user already exists', async () => {
  const repo = loadDeps('UserRepository') as FakeUserRepository
  const uc = loadDeps('CreateUserUseCase')
  
  repo.clear()

  await repo.save({ id: 'existing', email: 'test@example.com', passwordHash: 'hash' })

  await assertRejects(
    () => uc.execute({ email: 'test@example.com', password: 'new' }),
    Error,
    'UserAlreadyExists'
  )
})
