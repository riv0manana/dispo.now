import { UserRepository } from '@/core/application/ports/UserRepository.ts';
import { User } from '@/core/domain/user/User.schema.ts';
import { db, schema } from '@/infra/database/client.ts';
import { eq } from 'drizzle-orm';

export class DrizzleUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    await db.insert(schema.users)
      .values(user)
      .onConflictDoUpdate({ target: schema.users.id, set: user });
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(schema.users.email, email)
    });
    return result || null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.query.users.findFirst({
      where: eq(schema.users.id, id)
    });
    return result || null;
  }
}
