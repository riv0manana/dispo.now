import { assertEquals } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeProjectRepository } from '@/core/tests/fakes/FakeProjectRepository.ts'

Deno.test('lists projects by user', async () => {
  const repo = loadDeps('ProjectRepository') as FakeProjectRepository
  const uc = loadDeps('GetProjectsUseCase')
  
  repo.clear()

  await repo.save({ id: 'p1', userId: 'u1', name: 'P1', apiKey: 'k1', metadata: {} })
  await repo.save({ id: 'p2', userId: 'u2', name: 'P2', apiKey: 'k2', metadata: {} })
  await repo.save({ id: 'p3', userId: 'u1', name: 'P3', apiKey: 'k3', metadata: {} })

  const projects = await uc.execute('u1')
  assertEquals(projects.length, 2)
  assertEquals(projects[0].id, 'p1')
  assertEquals(projects[1].id, 'p3')
})
