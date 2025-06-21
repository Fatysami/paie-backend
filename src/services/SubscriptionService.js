import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const SubscriptionService = {
 async getAll(params) {
    const {
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'desc',
      search = '',
      filter = {}
    } = params;

    const where = {
      AND: [
        search
          ? {
              OR: [
                { plan: { contains: search, mode: 'insensitive' } },
                { status: { contains: search, mode: 'insensitive' } },
                { billing_cycle: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},
        ...Object.entries(filter).map(([key, value]) => {
          if (key === 'company_id') return { company_id: value };
          if (key === 'status') return { status: value };
          return {};
        })
      ]
    };

    const total = await prisma.subscriptions.count({ where });
    const data = await prisma.subscriptions.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    return {
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      filters: {
        applied: { search, ...filter }
      }
    };
  },

  async getByCompany(companyId) {
    return prisma.subscriptions.findMany({
      where: { company_id: companyId }
    });
  },

  async create(data) {
    return prisma.subscriptions.create({ data });
  },

  async update(id, data) {
    return prisma.subscriptions.update({
      where: { id },
      data
    });
  },

  async remove(id) {
    return prisma.subscriptions.delete({
      where: { id }
    });
  }
};

export default SubscriptionService;
