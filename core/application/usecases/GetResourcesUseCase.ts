import { ResourceRepository } from '@/core/application/ports/ResourceRepository.ts'
import { Resource } from '@/core/domain/resource/Resource.schema.ts'

export class GetResourcesUseCase {
  constructor(private repo: ResourceRepository) {}

  async execute(projectId: string): Promise<Resource[]> {
    return this.repo.findByProjectId(projectId)
  }
}
