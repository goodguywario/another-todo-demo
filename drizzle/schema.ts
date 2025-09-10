import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: text('name').notNull(),
});

export const taskItems = pgTable('task_items', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  title: text('title').notNull(),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`now()`),
});

// Simple trigger update snippet (optional) - you could apply manually in a migration.
export const updateTimestampTrigger = sql`
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';
`;
