import { sql } from 'drizzle-orm';
import { index, timestamp, varchar } from 'drizzle-orm/pg-core';
import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { ContactCategories } from './contact-category-model';
import { unique } from 'drizzle-orm/pg-core';

export const Contacts = pgTable(
  'contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').notNull(),
    first_name: varchar('first_name', { length: 100 }).notNull(),
    last_name: varchar('last_name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    company: varchar('company', { length: 100 }),
    contact_category_id: varchar('contact_category_id', { length: 50 }).references(
      () => ContactCategories.id,
      {
        onDelete: 'set null',
      },
    ),
    created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'string' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`now()`),
  },
  (table) => [
    index('contact_user_idx').on(table.user_id),
    index('contact_email_idx').on(table.email),
    index('contact_category_idx').on(table.contact_category_id),
    index('contact_name_idx').on(table.first_name, table.last_name),
    index('contact_created_at_idx').on(table.created_at),
    unique('contact_user_email_phone_unique_idx').on(table.user_id, table.email, table.phone),
  ],
);
