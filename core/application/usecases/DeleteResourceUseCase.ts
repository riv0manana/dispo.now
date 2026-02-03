import { ResourceRepository } from '../ports/ResourceRepository.ts'

export class DeleteResourceUseCase {
  constructor(private repo: ResourceRepository) {}

  async execute(params: { resourceId: string; projectId: string }): Promise<void> {
    const resource = await this.repo.findById(params.resourceId)
    if (!resource) {
      throw new Error('ResourceNotFound')
    }
    if (resource.projectId !== params.projectId) {
      throw new Error('UnauthorizedOperation')
    }
    await this.repo.delete(params.resourceId)
  }
}
