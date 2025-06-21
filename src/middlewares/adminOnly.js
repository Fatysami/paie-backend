export default function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: "Accès réservé aux administrateurs." });
  }
  next();
}
