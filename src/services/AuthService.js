import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken, generateRefreshToken } from '../utils/generateToken.js';
import crypto from 'crypto';

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
  },

  async requestPasswordReset(email) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) throw new Error('Utilisateur non trouvé');

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1h

    await prisma.users.update({
      where: { email },
      data: {
        reset_token: token,
        reset_token_expiry: expiry
      }
    });

    return { token }; // Tu pourras l'envoyer par e-mail plus tard
  },

  async updatePassword(email, newPassword) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) throw new Error('Utilisateur non trouvé');

    const hashed = await bcrypt.hash(newPassword, 12);

    await prisma.users.update({
      where: { email },
      data: {
        password_hash: hashed,
        reset_token: null,
        reset_token_expiry: null
      }
    });

    return { message: 'Mot de passe mis à jour' };
  }
};

export default AuthService;
