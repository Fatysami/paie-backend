import { Router } from 'express';
import SettingsController from '../controllers/SettingsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Admin global ONLY
router.use(authMiddleware, (req, res, next) => {
  const isGlobalAdmin =
    req.user.role === 'admin' && req.user.companyId === null;

  if (isGlobalAdmin) return next();

  return res.status(403).json({
    success: false,
    message: "Réservé à l'administrateur global"
  });
});
// GET settings
router.get('/', SettingsController.get);

// PUT settings
router.put('/', SettingsController.update);

export default router;
