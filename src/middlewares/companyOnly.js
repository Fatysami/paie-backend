export function companyOnly(req, res, next) {
  if (req.user.role === 'admin') return next();

  const requestedCompanyId =
    req.params.id || req.body.companyId || req.query.companyId;

  if (!requestedCompanyId) {
    return res.status(400).json({
      success: false,
      message: 'ID entreprise manquant dans la requête.'
    });
  }

  if (requestedCompanyId !== req.user.companyId) {
    return res.status(403).json({
      success: false,
      message: "Accès interdit à cette entreprise."
    });
  }

  next();
}
