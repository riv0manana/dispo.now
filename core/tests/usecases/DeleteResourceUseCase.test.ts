import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'
import { ResourceSchema } from '@/core/domain/resource/Resource.schema.ts'

Deno.test('DeleteResourceUseCase', async (t) => {
  const repo = loadDeps('ResourceRepository') as FakeResourceRepository
  const useCase = loadDeps('DeleteResourceUseCase')
  
  repo.clear()

  const resource = ResourceSchema.parse({
    id: 'r-1',
    projectId: 'p-1',
    name: 'Resource A',
    defaultCapacity: 1,
    metadata: {}
  })
  await repo.save(resource)

  await t.step('should delete resource', async () => {
    await useCase.execute({ resourceId: 'r-1', projectId: 'p-1' })
    const found = await repo.findById('r-1')
    assertEquals(found, null)
  })

  await t.step('should unauthorized', async () => {
    await repo.save(resource)
    await assertRejects(
      () => useCase.execute({ resourceId: 'r-1', projectId: 'p-2' }),
      Error,
      'UnauthorizedOperation'
    )
  })
})
