import { ProjectRepository } from '@/core/application/ports/ProjectRepository.ts'

export class VerifyApiKeyUseCase {
  constructor(private repo: ProjectRepository) {}

  async execute(apiKey: string): Promise<string> {
    const project = await this.repo.findByApiKey(apiKey)
    if (!project) {
      throw new Error('InvalidApiKey')
    }
    return project.id
  }
}
