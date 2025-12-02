import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminOnly.js';
import { companyOnly } from '../middlewares/companyOnly.js';
import { validate, schemas } from '../middlewares/validation.js';
import { subscriptionMinLevel } from '../middlewares/subscriptionMinLevel.js';
import managerOrAdmin from '../middlewares/managerOrAdmin.js';
import { checkSubscriptionLimits } from '../middlewares/checkSubscriptionLimits.js';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

/* ------------------------------ GET USERS ------------------------------ */

// Admin global → OK
// Admin d’entreprise → OK
// RH/Manager → accès aux users de leur entreprise (géré dans service + middlewares)
router.get('/', UserController.getAll);

/* ------------------------------ GET USER BY ID ------------------------------ */
router.get('/:id', companyOnly, UserController.getById);

/* ------------------------------ GET USERS BY COMPANY ------------------------------ */
router.get('/company/:id', companyOnly, UserController.getByCompany);

/* ------------------------------ CREATE USER ------------------------------ */

router.post(
  '/',
  managerOrAdmin,                           // admin + manager
  subscriptionMinLevel(['pro', 'premium']), // vérifier l'abonnement
  checkSubscriptionLimits,                  // limite plan (nb users/employés)

  // 🔥 Middleware CRUCIAL : Contrôle du rôle et de la company_id
  (req, res, next) => {
    const requester = req.user;          // utilisateur qui crée
    const newRole = req.body.role;       // rôle demandé
    let companyId = req.body.company_id; // entreprise du nouvel utilisateur

    // ******************************************************
    // 1️⃣ Si RH / Manager → Interdit de créer un admin
    // ******************************************************
    if (requester.role !== 'admin' && newRole === 'admin') {
      return res.status(403).json({
        success: false,
        message: "Seul un administrateur global peut créer un admin."
      });
    }

    // ******************************************************
    // 2️⃣ Si RH ou manager → ne peut créer QUE dans sa company
    // ******************************************************
    if (requester.role !== 'admin') {
      req.body.company_id = requester.company_id; // FORCÉ
    }

    // ******************************************************
    // 3️⃣ Si admin GLOBAL → peut créer un admin global
    // ******************************************************
    if (requester.role === 'admin' && requester.company_id === null) {
      
      // Si l’admin global crée un admin → company_id doit être null
      if (newRole === 'admin') {
        req.body.company_id = null;
      }

      // Si l’admin global crée un employee/manager → company_id OBLIGATOIRE
      if (newRole !== 'admin' && !companyId) {
        return res.status(400).json({
          success: false,
          message: "company_id requis pour ce rôle."
        });
      }
    }

    // ******************************************************
    // 4️⃣ Admin d’entreprise → NE PEUT PAS créer d’admin global
    // ******************************************************
    if (requester.role === 'admin' && requester.company_id !== null) {
      if (newRole === 'admin') {
        return res.status(403).json({
          success: false,
          message: "Un admin d’entreprise ne peut pas créer un administrateur global."
        });
      }

      // Forcer à sa propre entreprise
      req.body.company_id = requester.company_id;
    }

    next();
  },

  validate(schemas.user),
  UserController.create
);

/* ------------------------------ UPDATE USER ------------------------------ */
router.put('/:id', managerOrAdmin, companyOnly, UserController.update);

/* ------------------------------ DELETE USER ------------------------------ */
router.delete('/:id', adminOnly, UserController.remove);

export default router;
