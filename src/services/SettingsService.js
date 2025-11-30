import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const SettingsService = {

  async getAll() {
    const rows = await prisma.system_settings.findMany();

    const result = { general: {}, email: {}, security: {}, notifications: {} };

    rows.forEach(row => {
      result[row.category][row.key] = row.value;
    });

    return result;
  },

  async update(category, settings, userId) {

    const tasks = Object.entries(settings).map(([key, value]) =>
      prisma.system_settings.upsert({
        where: { category_key: { category, key } },
        update: { value, updated_by: userId, updated_at: new Date() },
        create: { category, key, value, updated_by: userId }
      })
    );

    await Promise.all(tasks);

    return this.getAll();
  }
};
