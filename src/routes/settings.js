import { Router } from 'express';
import SettingsController from '../controllers/SettingsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// accès admin global uniquement
router.use(authMiddleware, (req, res, next) => {
  if (req.user.role === 'admin' && req.user.companyId === null) return next();

  return res.status(403).json({
    success: false,
    message: "Réservé à l'administrateur global"
  });
});

router.get('/', SettingsController.get);
router.put('/', SettingsController.update);

export default router;
