import { ProjectRepository } from '@/core/application/ports/ProjectRepository.ts';
import { Project } from '@/core/domain/project/Project.schema.ts';
import { db, schema } from '@/infra/database/client.ts';
import { eq } from 'drizzle-orm';

export class DrizzleProjectRepository implements ProjectRepository {
  async save(project: Project): Promise<void> {
    await db.insert(schema.projects)
      .values(project)
      .onConflictDoUpdate({ target: schema.projects.id, set: project });
  }

  async findById(id: string): Promise<Project | null> {
    const result = await db.query.projects.findFirst({
      where: eq(schema.projects.id, id)
    });
    return result || null;
  }

  async listByUserId(userId: string): Promise<Project[]> {
    return await db.query.projects.findMany({
      where: eq(schema.projects.userId, userId)
    });
  }

  async findByApiKey(apiKey: string): Promise<Project | null> {
    const result = await db.query.projects.findFirst({
      where: eq(schema.projects.apiKey, apiKey)
    });
    return result || null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(schema.projects).where(eq(schema.projects.id, id));
  }
}
