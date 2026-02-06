import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeUserRepository } from '@/core/tests/fakes/FakeUserRepository.ts'
import { FakeRefreshTokenRepository } from '@/core/tests/fakes/FakeRefreshTokenRepository.ts'

Deno.test('logs in successfully', async () => {
  const repo = loadDeps('UserRepository') as FakeUserRepository
  const tokenService = loadDeps('TokenService')
  const uc = loadDeps('LoginUserUseCase')
  
  repo.clear()
  const refreshTokenRepo = loadDeps('RefreshTokenRepository') as FakeRefreshTokenRepository
  refreshTokenRepo.clear()

  await repo.save({
    id: 'u1',
    email: 'test@example.com',
    passwordHash: 'hashed_password123'
  })

  const result = await uc.execute({ email: 'test@example.com', password: 'password123' })
  const payload = await tokenService.verify(result.token)
  
  assertEquals(payload.userId, 'u1')
  assertEquals(payload.email, 'test@example.com')
  assertEquals(typeof result.refreshToken, 'string')
})

Deno.test('fails with wrong password', async () => {
  const repo = loadDeps('UserRepository') as FakeUserRepository
  const uc = loadDeps('LoginUserUseCase')
  
  repo.clear()

  await repo.save({
    id: 'u1',
    email: 'test@example.com',
    passwordHash: 'hashed_password123'
  })

  await assertRejects(
    () => uc.execute({ email: 'test@example.com', password: 'wrong' }),
    Error,
    'InvalidCredentials'
  )
})
