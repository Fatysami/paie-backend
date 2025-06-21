import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken, generateRefreshToken } from '../utils/generateToken.js';

const prisma = new PrismaClient();

const AuthService = {
  async signup(data) {
    const { email, password, role, company_id } = data;

    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) throw new Error('Email déjà utilisé');

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        email,
        password_hash: hashed,
        role,
        company_id,
        is_active: true
      }
    });

    return {
      token: generateToken(user),
      refreshToken: generateRefreshToken(user),
      user
    };
  },

  async login(email, password) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) throw new Error('Utilisateur non trouvé');

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error('Mot de passe incorrect');

    return {
      token: generateToken(user),
      refreshToken: generateRefreshToken(user),
      user
    };
  },

  async me(userId) {
    return await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        company_id: true,
        first_name: true,
        last_name: true,
        is_active: true,
        created_at: true
      }
    });
  }
};

export default AuthService;
