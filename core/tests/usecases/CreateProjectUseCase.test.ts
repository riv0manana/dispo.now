import { assertEquals, assertStringIncludes } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeProjectRepository } from '@/core/tests/fakes/FakeProjectRepository.ts'

Deno.test('creates project with api key', async () => {
  const repo = loadDeps('ProjectRepository') as FakeProjectRepository
  const uc = loadDeps('CreateProjectUseCase')
  
  repo.clear()

  const result = await uc.execute({
    userId: 'user_1',
    name: 'My Project',
    metadata: { key: 'value' }
  })

  assertStringIncludes(result.apiKey, 'sk_live_')

  const stored = await repo.findById(result.id)
  assertEquals(stored?.apiKey, result.apiKey)
  assertEquals(stored?.userId, 'user_1')
})
