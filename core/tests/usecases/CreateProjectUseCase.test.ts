import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { CreateProjectUseCase } from '@/core/application/usecases/CreateProjectUseCase.ts'
import { FakeProjectRepository } from '@/core/tests/fakes/FakeProjectRepository.ts'

Deno.test('creates project with api key', async () => {
  const repo = new FakeProjectRepository()
  const uc = new CreateProjectUseCase(
    repo,
    { generate: () => 'p1' },
    { generate: () => 'api_key_secret' }
  )

  const result = await uc.execute({
    userId: 'user_1',
    name: 'My Project',
    metadata: { key: 'value' }
  })

  assertEquals(result.id, 'p1')
  assertEquals(result.apiKey, 'api_key_secret')

  const stored = await repo.findById('p1')
  assertEquals(stored?.apiKey, 'api_key_secret')
  assertEquals(stored?.userId, 'user_1')
})
