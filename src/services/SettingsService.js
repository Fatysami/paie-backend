import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const SettingsService = {

  async getAll() {
    const rows = await prisma.system_settings.findMany();

    const result = {
      general: {},
      email: {},
      security: {},
      notifications: {}
    };

    for (const row of rows) {
      if (result[row.category]) {
        result[row.category][row.key] = row.value;
      }
    }

    return result;
  },

  async update(category, settings, userId) {
    const updates = [];

    for (const [key, value] of Object.entries(settings)) {
      updates.push(
        prisma.system_settings.upsert({
          where: {
            category_key: { category, key }
          },
          update: {
            value,
            updated_by: userId,
            updated_at: new Date()
          },
          create: {
            category,
            key,
            value,
            updated_by: userId
          }
        })
      );
    }

    await Promise.all(updates);

    return this.getAll();
  }
};
