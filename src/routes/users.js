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

// 🔐 Toutes les routes nécessitent d'être connecté
router.use(authMiddleware);

// GET /api/users → Admin global doit passer
router.get('/', UserController.getAll);

// GET /api/users/:id
router.get('/:id', companyOnly, UserController.getById);

// GET /api/users/company/:id
router.get('/company/:id', companyOnly, UserController.getByCompany);

// POST /api/users
router.post(
  '/',
  managerOrAdmin,
  subscriptionMinLevel(['pro', 'premium']),
  checkSubscriptionLimits,
  validate(schemas.user),
  UserController.create
);

// PUT /api/users/:id
router.put('/:id', managerOrAdmin, companyOnly, UserController.update);

// DELETE /api/users/:id
router.delete('/:id', adminOnly, UserController.remove);

export default router;
