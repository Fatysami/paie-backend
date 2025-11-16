import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export function subscriptionAccess(requiredPlans = []) {
  return async (req, res, next) => {
    try {
      const companyId = req.user.company_id;

      if (!companyId) return res.status(403).json({ success: false, message: 'Entreprise introuvable' });

      const subscription = await prisma.subscriptions.findFirst({
        where: {
          company_id: companyId,
          status: 'active',
          end_date: { gte: new Date() }
        }
      });

      if (!subscription) {
        return res.status(403).json({ success: false, message: 'Pas d’abonnement actif' });
      }

      if (!requiredPlans.includes(subscription.plan)) {
        return res.status(403).json({ success: false, message: `Plan requis : ${requiredPlans.join(', ')}` });
      }

      next();
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}