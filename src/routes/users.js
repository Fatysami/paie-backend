import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminOnly.js';
import { companyOnly } from '../middlewares/companyOnly.js';
import { validate, schemas } from '../middlewares/validation.js';
import { subscriptionMinLevel } from '../middlewares/subscriptionAccessLevel.js';
import managerOrAdmin from '../middlewares/managerOrAdmin.js';

const router = Router();

// 🔐 Toutes les routes nécessitent d'être connecté
router.use(authMiddleware); 

// 🔍 Liste tous les utilisateurs (admin/rh uniquement - à restreindre plus tard)
router.get('/', subscriptionMinLevel('pro'), UserController.getAll);

// 🔍 Détail d’un utilisateur
router.get('/:id', companyOnly, UserController.getById);

// 🔍 Utilisateurs d’une entreprise (accès restreint à sa propre entreprise)
router.get('/company/:id', companyOnly, UserController.getByCompany);


// ➕ Créer un utilisateur (accessible aux managers ou admins avec abonnement pro+)
router.post('/', managerOrAdmin, subscriptionMinLevel('pro'), validate(schemas.user), UserController.create);


// 🔄 Modifier un utilisateur (manager/admin uniquement, entreprise concernée)
router.put('/:id', managerOrAdmin, companyOnly, UserController.update);


// ❌ Supprimer un utilisateur (admin uniquement)
router.delete('/:id', adminOnly, UserController.remove);

export default router;
