import { Router } from 'express';
import SettingsController from '../controllers/SettingsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Admin global ONLY
router.use(authMiddleware, (req, res, next) => {
  if (req.user.role === 'admin' && req.user.company_id === null) {
    return next();
  }
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
