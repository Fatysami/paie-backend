export function companyOnly(req, res, next) {
  const user = req.user;

  // ADMIN GLOBAL → accès total
  if (user.role === 'admin' && user.company_id === null) {
    return next();
  }

  // ADMIN ENTREPRISE → accès total
  if (user.role === 'admin' && user.company_id !== null) {
    return next();
  }

  // RH / MANAGER → accès limité à leur entreprise
  const requestedCompanyId =
    req.params.company_id ||
    req.params.id ||
    req.body.company_id ||
    req.query.company_id;

  if (!requestedCompanyId) {
    return res.status(400).json({
      success: false,
      message: "company_id manquant dans la requête."
    });
  }

  if (requestedCompanyId != user.company_id) {
    return res.status(403).json({
      success: false,
      message: "Accès interdit à cette entreprise."
    });
  }

  next();
}
