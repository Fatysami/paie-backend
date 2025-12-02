import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function blockIfNoSubscription(req, res, next) {
  const companyId = req.user.companyId;

  // Admin global passe toujours
  if (req.user.role === 'admin' && companyId === null) return next();

  const subscription = await prisma.subscriptions.findFirst({
    where: {
      company_id: companyId,
      status: 'active',
      end_date: { gte: new Date() }
    }
  });

  if (!subscription) {
    return res.status(402).json({
      success: false,
      message: "Votre abonnement a expiré ou est suspendu. Veuillez le renouveler."
    });
  }

  next();
}
