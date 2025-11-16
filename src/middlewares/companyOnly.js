export function companyOnly(req, res, next) {
  const user = req.user;

  // 1. Admin global (company_id null) : accès complet
  if (user.role === 'admin' && user.company_id === null) {
    return next();
  }

  // 2. Admin associé à une entreprise : accès OK
  if (user.role === 'admin') {
    return next();
  }

  // 3. Pour les autres rôles (RH, manager, etc.)
  const requestedCompanyId =
    req.params.company_id ||
    req.params.id ||
    req.body.company_id ||
    req.query.company_id;

  if (!requestedCompanyId) {
    return res.status(400).json({
      success: false,
      message: 'company_id manquant dans la requête.'
    });
  }

  if (requestedCompanyId != user.company_id) {
    return res.status(403).json({
      success: false,
      message: 'Accès interdit à cette entreprise.'
    });
  }

  next();
}
