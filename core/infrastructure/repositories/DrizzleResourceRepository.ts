import { ResourceRepository } from '@/core/application/ports/ResourceRepository.ts';
import { Resource } from '@/core/domain/resource/Resource.schema.ts';
import { db, schema } from '@/infra/database/client.ts';
import { eq } from 'drizzle-orm';

export class DrizzleResourceRepository implements ResourceRepository {
  async save(resource: Resource): Promise<void> {
    await db.insert(schema.resources)
      .values(resource)
      .onConflictDoUpdate({ target: schema.resources.id, set: resource });
  }

  async findById(id: string): Promise<Resource | null> {
    const result = await db.query.resources.findFirst({
      where: eq(schema.resources.id, id)
    });
    return result || null;
  }

  async findByProjectId(projectId: string): Promise<Resource[]> {
    return await db.query.resources.findMany({
      where: eq(schema.resources.projectId, projectId)
    });
  }

  async delete(id: string): Promise<void> {
    await db.delete(schema.resources).where(eq(schema.resources.id, id));
  }
}
