import { ProjectRepository } from '../ports/ProjectRepository.ts'

export class DeleteProjectUseCase {
  constructor(private repo: ProjectRepository) {}

  async execute(params: { projectId: string; userId: string }): Promise<void> {
    const project = await this.repo.findById(params.projectId)
    if (!project) {
      throw new Error('ProjectNotFound')
    }
    if (project.userId !== params.userId) {
      throw new Error('UnauthorizedOperation')
    }
    await this.repo.delete(params.projectId)
  }
}
