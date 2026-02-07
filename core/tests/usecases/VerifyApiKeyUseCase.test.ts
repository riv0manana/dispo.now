import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeProjectRepository } from '@/core/tests/fakes/FakeProjectRepository.ts'

Deno.test('verifies valid api key', async () => {
  const repo = loadDeps('ProjectRepository') as FakeProjectRepository
  const uc = loadDeps('VerifyApiKeyUseCase')
  
  repo.clear()

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
  const repo = loadDeps('ProjectRepository') as FakeProjectRepository
  const uc = loadDeps('VerifyApiKeyUseCase')
  
  repo.clear()

  await assertRejects(
    () => uc.execute('wrong_key'),
    Error,
    'InvalidApiKey'
  )
})
