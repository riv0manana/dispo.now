import { ResourceRepository } from '@/core/application/ports/ResourceRepository.ts'
import { ProjectRepository } from '@/core/application/ports/ProjectRepository.ts'
import { IdGenerator } from '@/core/application/ports/IdGenerator.ts'
import { ResourceSchema } from '@/core/domain/resource/Resource.schema.ts'

export class CreateResourceUseCase {
  constructor(
    private resourceRepo: ResourceRepository,
    private projectRepo: ProjectRepository,
    private idGen: IdGenerator
  ) {}

  async execute(input: {
    projectId: string
    name: string
    defaultCapacity?: number
    metadata: Record<string, unknown>
    bookingConfig?: {
      daily?: { start?: string; end?: string }
      weekly?: { availableDays?: number[] }
    }
  }): Promise<string> {
    const project = await this.projectRepo.findById(input.projectId)
    if (!project) throw new Error('ProjectNotFound')

    const resource = ResourceSchema.parse({
      id: this.idGen.generate(),
      projectId: input.projectId,
      name: input.name,
      defaultCapacity: input.defaultCapacity,
      metadata: input.metadata,
      bookingConfig: input.bookingConfig
    })
    await this.resourceRepo.save(resource)
    return resource.id
  }
}
