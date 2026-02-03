import { ProjectRepository } from '@/core/application/ports/ProjectRepository.ts'
import { Project } from '@/core/domain/project/Project.schema.ts'

export class GetProjectsUseCase {
  constructor(private repo: ProjectRepository) {}

  async execute(userId: string): Promise<Project[]> {
    return this.repo.listByUserId(userId)
  }
}
