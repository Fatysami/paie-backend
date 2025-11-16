import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export function subscriptionMinLevel(requiredPlans = []) {
  return async (req, res, next) => {
    try {
      const user = req.user;

      // 1️⃣ ADMIN GLOBAL → accès total
      if (user.role === 'admin' && user.company_id === null) {
        return next();
      }

      const companyId = user.company_id;

      // 2️⃣ Pour les autres rôles → l'entreprise doit exister
      if (!companyId) {
        return res.status(403).json({ 
          success: false, 
          message: 'Entreprise introuvable' 
        });
      }

      // 3️⃣ Vérification de l'abonnement
      const subscription = await prisma.subscriptions.findFirst({
        where: {
          company_id: companyId,
          status: 'active',
          end_date: { gte: new Date() }
        }
      });

      if (!subscription) {
        return res.status(403).json({ 
          success: false, 
          message: 'Pas d’abonnement actif' 
        });
      }

      // 4️⃣ Vérifier si le plan satisfait les exigences
      if (!requiredPlans.includes(subscription.plan)) {
        return res.status(403).json({
          success: false,
          message: `Plan requis : ${requiredPlans.join(', ')}`
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  };
}
