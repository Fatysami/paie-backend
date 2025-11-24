import { Router } from 'express';
import SettingsController from '../controllers/SettingsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Admin Global uniquement
router.use(authMiddleware, (req, res, next) => {
  if (req.user.role === 'admin' && req.user.company_id === null) return next();
  return res.status(403).json({ success: false, message: "Réservé à l'admin global" });
});

router.get('/', SettingsController.get);
router.put('/', SettingsController.update);

export default router;
