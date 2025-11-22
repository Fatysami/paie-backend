import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminOnly.js';
import { companyOnly } from '../middlewares/companyOnly.js';
import { validate, schemas } from '../middlewares/validation.js';
import { subscriptionMinLevel } from '../middlewares/subscriptionMinLevel.js';
import managerOrAdmin from '../middlewares/managerOrAdmin.js';

const router = Router();

// 🔐 Toutes les routes nécessitent d'être connecté
router.use(authMiddleware);

/**
 * GET /api/users
 * Admin global → OK (company_id null)
 * Admin entreprise → OK
 * RH/manager → doivent appartenir à une entreprise
 */
router.get(
  '/',
  subscriptionMinLevel(['pro', 'premium']), // exiger au moins ces plans
  UserController.getAll
);

/**
 * GET /api/users/:id
 * Admin global → OK
 * Admin entreprise → OK
 * RH/Manager → accès limité à leur entreprise
 */
router.get('/:id', companyOnly, UserController.getById);

/**
 * GET /api/users/company/:id
 * Accès restreint à l’entreprise de l’utilisateur
 */
router.get('/company/:id', companyOnly, UserController.getByCompany);

/**
 * POST /api/users
 * Admin global → peut créer un utilisateur pour n'importe quelle entreprise
 * Admin entreprise → pour son entreprise
 * RH/Manager → uniquement leur entreprise
 */
router.post(
  '/',
  managerOrAdmin,                       // rôle OK
  subscriptionMinLevel(['pro', 'premium']), // abonnement OK
  validate(schemas.user),
  UserController.create
);

/**
 * PUT /api/users/:id
 */
router.put(
  '/:id',
  managerOrAdmin,
  companyOnly,
  UserController.update
);

/**
 * DELETE /api/users/:id
 */
router.delete('/:id', adminOnly, UserController.remove);

export default router;
