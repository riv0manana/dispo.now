import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { LoginUserUseCase } from '@/core/application/usecases/LoginUserUseCase.ts'
import { FakeUserRepository } from '@/core/tests/fakes/FakeUserRepository.ts'
import { FakePasswordService } from '@/core/tests/fakes/FakePasswordService.ts'
import { FakeTokenService } from '@/core/tests/fakes/FakeTokenService.ts'

Deno.test('logs in successfully', async () => {
  const repo = new FakeUserRepository()
  const passwordService = new FakePasswordService()
  const tokenService = new FakeTokenService()
  const uc = new LoginUserUseCase(repo, passwordService, tokenService)

  await repo.save({
    id: 'u1',
    email: 'test@example.com',
    passwordHash: 'hashed_password123'
  })

  const result = await uc.execute({ email: 'test@example.com', password: 'password123' })
  const payload = await tokenService.verify(result.token)
  
  assertEquals(payload.userId, 'u1')
  assertEquals(payload.email, 'test@example.com')
})

Deno.test('fails with wrong password', async () => {
  const repo = new FakeUserRepository()
  const passwordService = new FakePasswordService()
  const tokenService = new FakeTokenService()
  const uc = new LoginUserUseCase(repo, passwordService, tokenService)

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
