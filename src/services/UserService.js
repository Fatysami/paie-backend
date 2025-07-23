import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcryptjs';

const UserService = {
async getAll(params) {
  const {
    page = 1,
    limit = 10,
    sort = 'created_at',
    order = 'desc',
    search = '',
    filter = {}
  } = params;

  // Convertir les filtres correctement (notamment is_active en booléen)
  const parsedFilter = {};
  for (const key in filter) {
    if (key === 'is_active') {
      parsedFilter[key] = filter[key] === 'true'; // cast en booléen
    } else {
      parsedFilter[key] = filter[key];
    }
  }

  const where = {
    AND: [
      search
        ? {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { first_name: { contains: search, mode: 'insensitive' } },
              { last_name: { contains: search, mode: 'insensitive' } }
            ]
          }
        : {},
      ...Object.entries(parsedFilter).map(([key, value]) => ({
        [key]: value
      }))
    ]
  };

  const total = await prisma.users.count({ where });

  const data = await prisma.users.findMany({
    where,
    orderBy: { [sort]: order },
    skip: (page - 1) * limit,
    take: parseInt(limit),
    select: {
      id: true,
      email: true,
      role: true,
      company_id: true,
      first_name: true,
      last_name: true,
      is_active: true,
      created_at: true,
      last_login: true
    }
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
      applied: { search, ...parsedFilter }
    }
  };
},

  async findById(id) {
    return prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        company_id: true,
        first_name: true,
        last_name: true,
        is_active: true,
        last_login: true,
        created_at: true
      }
    });
  },

  async findByCompany(companyId) {
    return prisma.users.findMany({
      where: { company_id: companyId },
      select: {
        id: true,
        email: true,
        role: true,
        company_id: true,
        first_name: true,
        last_name: true,
        is_active: true,
        last_login: true,
        created_at: true
      }
    });
  },

  async create(data) {
  const { email, password, role, company_id, first_name, last_name } = data;

  if (!email || !password || !role) {
    throw new Error('Champs requis manquants');
  }

  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) throw new Error('Email déjà utilisé');

  const hashed = await bcrypt.hash(password, 12);

  return prisma.users.create({
    data: {
      email,
      password_hash: hashed,
      role,
      company_id,
      first_name,
      last_name,
      is_active: true
    }
  });
},

  async update(id, data) {
    return prisma.users.update({
      where: { id },
      data
    });
  },

  async remove(id) {
    return prisma.users.delete({ where: { id } });
  }
};

export { UserService };
