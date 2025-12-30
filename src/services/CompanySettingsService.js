import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CompanySettingsService = {
  async getCompany(companyId) {
    const company = await prisma.companies.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        postal_code: true,
        phone: true,
        email: true,
        currency: true,
        ice: true,
        rc: true,
        cnss_number: true,
        logo_url: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!company) {
      throw new Error('Société introuvable');
    }

    return company;
  },

  async updateCompany(companyId, data) {
    if (!data.name) throw new Error('name obligatoire');
    if (!data.address) throw new Error('address obligatoire');
    if (!data.email) throw new Error('email obligatoire');

    if (data.ice && data.ice.length !== 15) {
      throw new Error('ICE doit contenir 15 chiffres');
    }

    return await prisma.companies.update({
      where: { id: companyId },
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        phone: data.phone,
        email: data.email,
        currency: data.currency,
        ice: data.ice,
        rc: data.rc,
        cnss_number: data.cnss_number,
        updated_at: new Date()
      }
    });
  }
};

export default CompanySettingsService;
