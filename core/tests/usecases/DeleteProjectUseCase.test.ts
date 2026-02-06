import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeProjectRepository } from '@/core/tests/fakes/FakeProjectRepository.ts'
import { ProjectSchema } from '@/core/domain/project/Project.schema.ts'

Deno.test('DeleteProjectUseCase', async (t) => {
  const repo = loadDeps('ProjectRepository') as FakeProjectRepository
  const useCase = loadDeps('DeleteProjectUseCase')
  
  repo.clear()

  const project = ProjectSchema.parse({
    id: 'p-1',
    userId: 'u-1',
    name: 'Project A',
    apiKey: 'key-1',
    metadata: {}
  })
  await repo.save(project)

  await t.step('should delete project', async () => {
    await useCase.execute({ projectId: 'p-1', userId: 'u-1' })
    const found = await repo.findById('p-1')
    assertEquals(found, null)
  })

  await t.step('should unauthorized', async () => {
    await repo.save(project)
    await assertRejects(
      () => useCase.execute({ projectId: 'p-1', userId: 'u-2' }),
      Error,
      'UnauthorizedOperation'
    )
  })
})
