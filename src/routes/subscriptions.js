import { Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminOnly.js';
import { companyOnly } from '../middlewares/companyOnly.js';
import { validate, schemas } from '../middlewares/validation.js';

const router = Router();

router.use(authMiddleware);

// Admin uniquement
router.get('/', adminOnly, SubscriptionController.getAll);
router.get('/company/:id', authMiddleware, companyOnly, SubscriptionController.getByCompany);
router.post('/', authMiddleware, companyOnly, validate(schemas.subscription), SubscriptionController.create);
router.put('/:id', adminOnly, SubscriptionController.update);
router.delete('/:id', adminOnly, SubscriptionController.remove);

export default router;
