import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CompanyService = {
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
              { name: { contains: search, mode: 'insensitive' } },
              { sector: { contains: search, mode: 'insensitive' } },
              { siret: { contains: search, mode: 'insensitive' } }
            ]
          }
        : {},
      ...Object.entries(filter).map(([key, value]) => ({
        [key]: value
      }))
    ]
  };

  const total = await prisma.companies.count({ where });
  const data = await prisma.companies.findMany({
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

  async getById(id) {
    return prisma.companies.findUnique({ where: { id } });
  },

  async create(data) {
    return prisma.companies.create({ data });
  },

  async update(id, data) {
    return prisma.companies.update({ where: { id }, data });
  },

  async remove(id) {
    return prisma.companies.delete({ where: { id } });
  }
};

export default CompanyService;
