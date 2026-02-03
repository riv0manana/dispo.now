import { ProjectRepository } from '../ports/ProjectRepository.ts'
import { ProjectSchema } from '../../domain/project/Project.schema.ts'

export class UpdateProjectUseCase {
  constructor(private repo: ProjectRepository) {}

  async execute(params: {
    projectId: string
    userId: string
    data: {
      name?: string
      metadata?: Record<string, unknown>
    }
  }): Promise<void> {
    const project = await this.repo.findById(params.projectId)
    if (!project) {
      throw new Error('ProjectNotFound')
    }

    if (project.userId !== params.userId) {
      throw new Error('UnauthorizedOperation')
    }

    const updatedProject = ProjectSchema.parse({
      ...project,
      name: params.data.name ?? project.name,
      metadata: params.data.metadata ? { ...project.metadata, ...params.data.metadata } : project.metadata
    })

    await this.repo.save(updatedProject)
  }
}
