import { assertEquals } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'

Deno.test('lists resources by project', async () => {
  const repo = loadDeps('ResourceRepository') as FakeResourceRepository
  const uc = loadDeps('GetResourcesUseCase')
  
  repo.clear()

  await repo.save({ id: 'r1', projectId: 'p1', name: 'R1', defaultCapacity: 1, metadata: {} })
  await repo.save({ id: 'r2', projectId: 'p1', name: 'R2', defaultCapacity: 1, metadata: {} })
  await repo.save({ id: 'r3', projectId: 'p2', name: 'R3', defaultCapacity: 1, metadata: {} })

  const resources = await uc.execute('p1')
  assertEquals(resources.length, 2)
  assertEquals(resources.map(r => r.id), ['r1', 'r2'])
})
