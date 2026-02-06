import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeProjectRepository } from '@/core/tests/fakes/FakeProjectRepository.ts'
import { ProjectSchema } from '@/core/domain/project/Project.schema.ts'

Deno.test('UpdateProjectUseCase', async (t) => {
  const repo = loadDeps('ProjectRepository') as FakeProjectRepository
  const useCase = loadDeps('UpdateProjectUseCase')
  
  repo.clear()

  const project = ProjectSchema.parse({
    id: 'p-1',
    userId: 'u-1',
    name: 'Project A',
    apiKey: 'key-1',
    metadata: { plan: 'free' }
  })
  await repo.save(project)

  await t.step('should update name and metadata', async () => {
    await useCase.execute({
      projectId: 'p-1',
      userId: 'u-1',
      data: {
        name: 'Project B',
        metadata: { plan: 'pro' }
      }
    })

    const updated = await repo.findById('p-1')
    assertEquals(updated?.name, 'Project B')
    assertEquals(updated?.metadata, { plan: 'pro' })
  })

  await t.step('should unauthorized', async () => {
    await assertRejects(
      () => useCase.execute({
        projectId: 'p-1',
        userId: 'u-2',
        data: { name: 'Hacked' }
      }),
      Error,
      'UnauthorizedOperation'
    )
  })
})
