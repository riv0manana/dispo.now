import { pgTable, text, timestamp, jsonb, integer, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  revoked: integer('revoked').notNull().default(0), // 0: active, 1: revoked
}, (table) => {
  return {
    userIdIdx: index('refresh_tokens_user_id_idx').on(table.userId),
    tokenHashIdx: index('refresh_tokens_token_hash_idx').on(table.tokenHash),
  };
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  apiKey: text('api_key').notNull(),
  metadata: jsonb('metadata').notNull().default({}),
}, (table) => {
  return {
    userIdIdx: index('projects_user_id_idx').on(table.userId),
    apiKeyIdx: index('projects_api_key_idx').on(table.apiKey),
  };
});

export const resources = pgTable('resources', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  defaultCapacity: integer('default_capacity').notNull(),
  metadata: jsonb('metadata').notNull().default({}),
  bookingConfig: jsonb('booking_config'),
}, (table) => {
  return {
    projectIdIdx: index('resources_project_id_idx').on(table.projectId),
  };
});

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  resourceId: text('resource_id').notNull().references(() => resources.id, { onDelete: 'cascade' }),
  start: timestamp('start').notNull(),
  end: timestamp('end').notNull(),
  quantity: integer('quantity').notNull(),
  metadata: jsonb('metadata').notNull().default({}),
  status: text('status').notNull(), // 'active', 'cancelled'
}, (table) => {
  return {
    resourceIdIdx: index('bookings_resource_id_idx').on(table.resourceId),
    projectIdIdx: index('bookings_project_id_idx').on(table.projectId),
    // Composite index for time-range queries on a resource (critical for availability checks)
    resourceTimeIdx: index('bookings_resource_time_idx').on(table.resourceId, table.start, table.end),
    timeRangeCheck: check('bookings_time_range_check', sql`${table.start} < ${table.end}`),
    quantityCheck: check('bookings_quantity_check', sql`${table.quantity} > 0`),
  };
});
