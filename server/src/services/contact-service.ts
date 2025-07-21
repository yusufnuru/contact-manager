import { db } from '../config/db.js';
import { Contacts } from '../models/contact-model.js';
import { type PgDatabase } from '../config/db.js';
import {
  CreateContactSchema,
  UpdateContactSchema,
  DeleteContactSchema,
  QueryContactsSchema,
} from '../schemas/contact-schema.js';
import { and, eq, ilike, or } from 'drizzle-orm';
import { CONFLICT, NOT_FOUND } from '../constants/http.js';
import appAssert from '../utils/app-assert.js';
import { asc } from 'drizzle-orm';
import { desc } from 'drizzle-orm';

export default class ContactService {
  constructor(private db: PgDatabase) {}

  async getContacts(userId: string, query: QueryContactsSchema) {
    const { limit = 10, page = 1, search, category, sortBy = 'created_at', order = 'desc' } = query;

    const offset = (page - 1) * limit;

    const whereConditions = [
      eq(Contacts.user_id, userId),

      search
        ? or(
            ilike(Contacts.first_name, `%${search}%`),
            ilike(Contacts.last_name, `%${search}%`),
            ilike(Contacts.email, `%${search}%`),
            ilike(Contacts.phone, `%${search}%`),
          )
        : undefined,

      category ? eq(Contacts.contact_category_id, category) : undefined,
    ].filter(Boolean);

    const contacts = await this.db.query.Contacts.findMany({
      where: and(...whereConditions),
      orderBy:
        sortBy === 'first_name'
          ? order === 'asc'
            ? asc(Contacts.first_name)
            : desc(Contacts.first_name)
          : sortBy === 'last_name'
            ? order === 'asc'
              ? asc(Contacts.last_name)
              : desc(Contacts.last_name)
            : order === 'asc'
              ? asc(Contacts.created_at)
              : desc(Contacts.created_at),
      limit,
      offset,
    });

    const total = await db.$count(Contacts, and(...whereConditions));

    return {
      data: contacts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createContact(contactData: CreateContactSchema) {
    const existingContact = await this.db.query.Contacts.findFirst({
      where: and(
        eq(Contacts.user_id, contactData.user_id),
        eq(Contacts.email, contactData.email),
        eq(Contacts.phone, contactData.phone),
      ),
    });

    appAssert(!existingContact, CONFLICT, 'Contact with this email and phone already exists');

    return this.db.insert(Contacts).values(contactData).returning();
  }

  async updateContact(contactId: string, contactData: UpdateContactSchema) {
    console.log('Updating contact with ID:', contactId);
    console.log('Contact Data:', contactData);
    const [contact] = await this.db
      .update(Contacts)
      .set({
        first_name: contactData?.first_name,
        last_name: contactData.last_name,
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company,
        contact_category_id: contactData.contact_category_id,
      })
      .where(and(eq(Contacts.id, contactId), eq(Contacts.user_id, contactData.user_id)))
      .returning();

    appAssert(contact, NOT_FOUND, 'Contact not found or does not belong to user');

    return contact;
  }

  async deleteContact(contactData: DeleteContactSchema) {
    const [contact] = await this.db
      .delete(Contacts)
      .where(and(eq(Contacts.id, contactData.id), eq(Contacts.user_id, contactData.user_id)))
      .returning();

    appAssert(contact, NOT_FOUND, 'Contact not found or does not belong to user');

    return contact;
  }

  async getContactById(userId: string, contactId: string) {
    const contact = await this.db.query.Contacts.findFirst({
      where: and(eq(Contacts.user_id, userId), eq(Contacts.id, contactId)),
    });

    appAssert(contact, NOT_FOUND, 'Contact not found or does not belong to user');

    return contact;
  }
}
