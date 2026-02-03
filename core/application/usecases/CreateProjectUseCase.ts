import { ProjectRepository } from '@/core/application/ports/ProjectRepository.ts'
import { IdGenerator } from '@/core/application/ports/IdGenerator.ts'
import { ApiKeyGenerator } from '@/core/application/ports/ApiKeyGenerator.ts'
import { ProjectSchema } from '@/core/domain/project/Project.schema.ts'

export class CreateProjectUseCase {
  constructor(
    private repo: ProjectRepository,
    private idGen: IdGenerator,
    private apiKeyGen: ApiKeyGenerator
  ) {}

  async execute(input: {
    userId: string
    name: string
    metadata: Record<string, unknown>
  }): Promise<{ id: string; apiKey: string }> { // Return both
    const apiKey = this.apiKeyGen.generate()
    
    const project = ProjectSchema.parse({
      id: this.idGen.generate(),
      userId: input.userId,
      name: input.name,
      apiKey,
      metadata: input.metadata
    })
    
    await this.repo.save(project)
    return { id: project.id, apiKey }
  }
}
