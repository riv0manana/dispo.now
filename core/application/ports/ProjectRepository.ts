import { Project } from '@/core/domain/project/Project.schema.ts'

export interface ProjectRepository {
  save(project: Project): Promise<void>
  findById(id: string): Promise<Project | null>
  listByUserId(userId: string): Promise<Project[]>
  findByApiKey(apiKey: string): Promise<Project | null>
  delete(id: string): Promise<void>
}
