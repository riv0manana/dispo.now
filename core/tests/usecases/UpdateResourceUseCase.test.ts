import { assertEquals, assertRejects } from 'std/assert/mod.ts'
import { loadDeps } from '@/container/index.ts'
import { FakeResourceRepository } from '@/core/tests/fakes/FakeResourceRepository.ts'
import { ResourceSchema } from '@/core/domain/resource/Resource.schema.ts'

Deno.test('UpdateResourceUseCase', async (t) => {
  const repo = loadDeps('ResourceRepository') as FakeResourceRepository
  const useCase = loadDeps('UpdateResourceUseCase')
  
  repo.clear()

  const resource = ResourceSchema.parse({
    id: 'res-1',
    projectId: 'proj-1',
    name: 'Room A',
    defaultCapacity: 10,
    metadata: { floor: 1 }
  })
  await repo.save(resource)

  await t.step('should update basic fields', async () => {
    await useCase.execute({
      resourceId: 'res-1',
      projectId: 'proj-1',
      data: {
        name: 'Room B',
        defaultCapacity: 20
      }
    })

    const updated = await repo.findById('res-1')
    assertEquals(updated?.name, 'Room B')
    assertEquals(updated?.defaultCapacity, 20)
    assertEquals(updated?.metadata, { floor: 1 }) // Preserved
  })

  await t.step('should update metadata (merge)', async () => {
    await useCase.execute({
      resourceId: 'res-1',
      projectId: 'proj-1',
      data: {
        metadata: { status: 'active' }
      }
    })

    const updated = await repo.findById('res-1')
    assertEquals(updated?.metadata, { floor: 1, status: 'active' })
  })

  await t.step('should set booking config with defaults', async () => {
    await useCase.execute({
      resourceId: 'res-1',
      projectId: 'proj-1',
      data: {
        bookingConfig: {
          daily: { start: '09:00' } // end should default to 23:59
        }
      }
    })

    const updated = await repo.findById('res-1')
    assertEquals(updated?.bookingConfig?.daily?.start, '09:00')
    assertEquals(updated?.bookingConfig?.daily?.end, '23:59')
    assertEquals(updated?.bookingConfig?.weekly?.availableDays, [0, 1, 2, 3, 4, 5, 6])
  })

  await t.step('should throw if unauthorized', async () => {
    await assertRejects(
      () => useCase.execute({
        resourceId: 'res-1',
        projectId: 'proj-2', // Wrong project
        data: { name: 'Hacked' }
      }),
      Error,
      'UnauthorizedOperation'
    )
  })

  await t.step('should throw if resource not found', async () => {
    await assertRejects(
      () => useCase.execute({
        resourceId: 'res-999',
        projectId: 'proj-1',
        data: { name: 'Ghost' }
      }),
      Error,
      'ResourceNotFound'
    )
  })
})
