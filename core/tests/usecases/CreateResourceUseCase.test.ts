import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'
import { FakeProjectRepository } from '@/core/tests/fakes/FakeProjectRepository.ts'

Deno.test('creates resource successfully', async () => {
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const projectRepo = loadDeps('ProjectRepository') as FakeProjectRepository
  const uc = loadDeps('CreateResourceUseCase')
  const tk = loadDeps('IdGenerator')
  
  resourceRepo.clear()
  projectRepo.clear()

  // Setup existing project
  const pId = tk.generate()
  await projectRepo.save({
    id: pId,
    userId: 'u1',
    name: 'Project 1',
    apiKey: 'k1',
    metadata: {}
  })

  const id = await uc.execute({
    projectId: pId,
    name: 'Meeting Room A',
    defaultCapacity: 5,
    metadata: { type: 'room' } // Users can use metadata for typing if they want
  })


  const stored = await resourceRepo.findById(id)
  assertEquals(stored?.projectId, pId)
  assertEquals(stored?.defaultCapacity, 5)
  assertEquals(stored?.metadata, { type: 'room' })
})

Deno.test('fails to create resource if project missing', async () => {
  const resourceRepo = loadDeps('ResourceRepository') as FakeResourceRepository
  const projectRepo = loadDeps('ProjectRepository') as FakeProjectRepository
  const uc = loadDeps('CreateResourceUseCase')
  
  resourceRepo.clear()
  projectRepo.clear()

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
