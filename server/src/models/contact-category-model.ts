import { sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const ContactCategories = pgTable(
  'contact_categories',
  {
    id: varchar('id', { length: 50 }).primaryKey(),
    label: text('label').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`now()`),
  },
  (table) => [
    index('contact_category_id_idx').on(table.id),
    index('contact_category_label_idx').on(table.label),
    index('contact_category_created_at_idx').on(table.created_at),
  ],
);
