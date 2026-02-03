import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { CreateResourceUseCase } from '@/core/application/usecases/CreateResourceUseCase.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'
import { FakeProjectRepository } from '@/core/tests/fakes/FakeProjectRepository.ts'

Deno.test('creates resource successfully', async () => {
  const resourceRepo = new FakeResourceRepository()
  const projectRepo = new FakeProjectRepository()
  const uc = new CreateResourceUseCase(resourceRepo, projectRepo, { generate: () => 'r1' })

  // Setup existing project
  await projectRepo.save({
    id: 'p1',
    userId: 'u1',
    name: 'Project 1',
    apiKey: 'k1',
    metadata: {}
  })

  const id = await uc.execute({
    projectId: 'p1',
    name: 'Meeting Room A',
    defaultCapacity: 5,
    metadata: { type: 'room' } // Users can use metadata for typing if they want
  })

  assertEquals(id, 'r1')

  const stored = await resourceRepo.findById('r1')
  assertEquals(stored?.projectId, 'p1')
  assertEquals(stored?.defaultCapacity, 5)
  assertEquals(stored?.metadata, { type: 'room' })
})

Deno.test('fails to create resource if project missing', async () => {
  const resourceRepo = new FakeResourceRepository()
  const projectRepo = new FakeProjectRepository()
  const uc = new CreateResourceUseCase(resourceRepo, projectRepo, { generate: () => 'r1' })

  await assertRejects(
    () => uc.execute({
      projectId: 'missing_project',
      name: 'Room',
      metadata: {}
    }),
    Error,
    'ProjectNotFound'
  )
})
