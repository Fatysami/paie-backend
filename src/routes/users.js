import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminOnly.js';
import { companyOnly } from '../middlewares/companyOnly.js';
import { validate, schemas } from '../middlewares/validation.js';

const router = Router();

router.use(authMiddleware); // Toutes les routes nécessitent auth

router.get('/', UserController.getAll); // admin/rh uniquement (à renforcer plus tard)
router.get('/:id', UserController.getById);
router.get('/company/:id', authMiddleware, companyOnly, UserController.getByCompany);

router.post('/', validate(schemas.user), UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', adminOnly, UserController.remove);

export default router;
