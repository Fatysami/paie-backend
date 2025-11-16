// middlewares/managerOrAdmin.js
export default function managerOrAdmin(req, res, next) {
  if (['admin', 'manager'].includes(req.user?.role)) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Accès réservé aux managers et admins.' });
}