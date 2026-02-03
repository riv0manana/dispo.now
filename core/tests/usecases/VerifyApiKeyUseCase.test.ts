import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { VerifyApiKeyUseCase } from '@/core/application/usecases/VerifyApiKeyUseCase.ts'
import { FakeProjectRepository } from '@/core/tests/fakes/FakeProjectRepository.ts'

Deno.test('verifies valid api key', async () => {
  const repo = new FakeProjectRepository()
  const uc = new VerifyApiKeyUseCase(repo)

  await repo.save({
    id: 'p1',
    userId: 'u1',
    name: 'P1',
    apiKey: 'secret_key',
    metadata: {}
  })

  const projectId = await uc.execute('secret_key')
  assertEquals(projectId, 'p1')
})

Deno.test('rejects invalid api key', async () => {
  const repo = new FakeProjectRepository()
  const uc = new VerifyApiKeyUseCase(repo)

  await assertRejects(
    () => uc.execute('wrong_key'),
    Error,
    'InvalidApiKey'
  )
})
