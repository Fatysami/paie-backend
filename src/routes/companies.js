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

/**
 * ADMIN GLOBAL → voir n’importe quelle entreprise
 * RH / Manager → voir uniquement leur entreprise
 */
router.get('/:id', companyOnly, CompanyController.show);

/**
 * ADMIN GLOBAL → créer entreprise + admin + abonnement trial
 */
router.post('/', adminOnly, CompanyController.create);

/**
 * ADMIN GLOBAL ou RH → modifier leur entreprise
 */
router.put('/:id', companyOnly, CompanyController.update);

/**
 * ADMIN GLOBAL → supprimer entreprise
 */
router.delete('/:id', adminOnly, CompanyController.delete);

export default router;