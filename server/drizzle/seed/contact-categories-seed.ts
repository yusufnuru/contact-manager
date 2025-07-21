import { db } from '../../src/config/db.js';
import { eq } from 'drizzle-orm';
import { ContactCategories } from '../../src/models/contact-category-model.js';

const contactCategoryData = [
  { id: 'family', label: 'Family' },
  { id: 'friends', label: 'Friends' },
  { id: 'work', label: 'Work' },
  { id: 'customer', label: 'Customer' },
  { id: 'vendor', label: 'Vendor' },
  { id: 'vip', label: 'VIP' },
  { id: 'partner', label: 'Partner' },
  { id: 'lead', label: 'Lead' },
  { id: 'other', label: 'Other' },
];

async function seedCategories() {
  for (const category of contactCategoryData) {
    const exists = await db
      .select()
      .from(ContactCategories)
      .where(eq(ContactCategories.id, category.id));

    if (exists.length === 0) {
      await db.insert(ContactCategories).values(category);
    }
  }

  console.log('✅ Categories seeded');
}

seedCategories().catch((err) => {
  console.error('❌ Failed to seed categories:', err);
});
