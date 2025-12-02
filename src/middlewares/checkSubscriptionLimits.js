import { PrismaClient } from '@prisma/client';
import { subscriptionLimits } from '../config/subscriptionPlans.js';

const prisma = new PrismaClient();

export async function checkSubscriptionLimits(req, res, next) {
  const companyId = req.body.company_id ?? req.user.companyId;
  if (!companyId) return next();

  // Récupérer l'abonnement actif
  const subscription = await prisma.subscriptions.findFirst({
    where: {
      company_id: companyId,
      status: 'active',
      end_date: { gte: new Date() }
    }
  });

  if (!subscription) return next(); // handled elsewhere

  const limits = subscriptionLimits[subscription.plan];

  if (!limits) return next();

  // Vérifier limite utilisateurs
  const countUsers = await prisma.users.count({
    where: { company_id: companyId }
  });

  if (countUsers >= limits.users) {
    return res.status(403).json({
      success: false,
      message: "Limite d'utilisateurs atteinte pour votre abonnement."
    });
  }

  next();
}
