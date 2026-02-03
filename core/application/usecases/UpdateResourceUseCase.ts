import { ResourceRepository } from '../ports/ResourceRepository.ts'
import { ResourceSchema } from '../../domain/resource/Resource.schema.ts'

export class UpdateResourceUseCase {
  constructor(private repo: ResourceRepository) {}

  async execute(params: {
    resourceId: string
    projectId: string
    data: {
      name?: string
      defaultCapacity?: number
      metadata?: Record<string, unknown>
      bookingConfig?: {
        daily?: { start?: string; end?: string }
        weekly?: { availableDays?: number[] }
      }
    }
  }): Promise<void> {
    const resource = await this.repo.findById(params.resourceId)
    if (!resource) {
      throw new Error('ResourceNotFound')
    }
    if (resource.projectId !== params.projectId) {
      throw new Error('UnauthorizedOperation')
    }

    // Merge booking config with defaults and existing
    let bookingConfig = resource.bookingConfig

    if (params.data.bookingConfig) {
      const daily = params.data.bookingConfig.daily || resource.bookingConfig?.daily || {}
      const weekly = params.data.bookingConfig.weekly || resource.bookingConfig?.weekly || {}

      bookingConfig = {
        daily: {
          start: daily.start ?? '00:00',
          end: daily.end ?? '23:59'
        },
        weekly: {
          availableDays: weekly.availableDays ?? [0, 1, 2, 3, 4, 5, 6]
        }
      }
    }

    const updatedResource = ResourceSchema.parse({
      ...resource,
      name: params.data.name ?? resource.name,
      defaultCapacity: params.data.defaultCapacity ?? resource.defaultCapacity,
      metadata: params.data.metadata ? { ...resource.metadata, ...params.data.metadata } : resource.metadata,
      bookingConfig
    })

    await this.repo.save(updatedResource)
  }
}
