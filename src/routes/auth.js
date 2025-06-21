import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { validate, schemas } from '../middlewares/validation.js';

const router = Router();

router.post('/signup', validate(schemas.signup), AuthController.signup);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', authMiddleware, AuthController.me); // <== ici
router.post('/refresh', AuthController.refreshToken);
export default router;
