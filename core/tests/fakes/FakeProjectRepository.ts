import { ProjectRepository } from '@/core/application/ports/ProjectRepository.ts'
import { Project } from '@/core/domain/project/Project.schema.ts'

export class FakeProjectRepository implements ProjectRepository {
  private items: Project[] = []

  async save(project: Project) {
    this.items = this.items.filter(p => p.id !== project.id)
    this.items.push(project)
  }

  async findById(id: string) {
    return this.items.find(p => p.id === id) ?? null
  }

  async listByUserId(userId: string) {
    return this.items.filter(p => p.userId === userId)
  }

  async findByApiKey(apiKey: string) {
    return this.items.find(p => p.apiKey === apiKey) ?? null
  }

  async delete(id: string) {
    this.items = this.items.filter(p => p.id !== id)
  }

  clear() {
    this.items = []
  }
}
