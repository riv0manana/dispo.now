import { Resource } from '@/core/domain/resource/Resource.schema.ts'

export interface ResourceRepository {
  save(resource: Resource): Promise<void>
  findById(id: string): Promise<Resource | null>
  findByProjectId(projectId: string): Promise<Resource[]>
  delete(id: string): Promise<void>
}
