import { Router } from 'express';
import CompanyController from '../controllers/CompanyController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminOnly.js';
import { companyOnly } from '../middlewares/companyOnly.js';

const router = Router();

/* --------------------------------
   PUBLIC ROUTE : INSCRIPTION ENTREPRISE
   Accessible sans login
-------------------------------- */
router.post('/public-register', CompanyController.publicRegister);

/* --------------------------------
   ROUTES PROTÉGÉES
-------------------------------- */
router.use(authMiddleware);

router.get('/', adminOnly, CompanyController.index);
router.get('/:id', CompanyController.show);
router.post('/', adminOnly, CompanyController.create);
router.put('/:id', authMiddleware, companyOnly, CompanyController.update);
router.delete('/:id', adminOnly, CompanyController.delete);

export default router;
