import { ResourceRepository } from '@/core/application/ports/ResourceRepository.ts'
import { Resource } from '@/core/domain/resource/Resource.schema.ts'

export class FakeResourceRepository implements ResourceRepository {
  private items: Resource[] = []

  async save(resource: Resource) {
    this.items = this.items.filter(r => r.id !== resource.id)
    this.items.push(resource)
  }

  async findById(id: string) {
    return this.items.find(r => r.id === id) ?? null
  }

  async findByProjectId(projectId: string) {
    return this.items.filter(r => r.projectId === projectId)
  }

  async delete(id: string) {
    this.items = this.items.filter(r => r.id !== id)
  }
}
