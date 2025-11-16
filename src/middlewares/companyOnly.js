export function companyOnly(req, res, next) {
  // Autoriser admin global sans restriction
  if (req.user.role === 'admin' && !req.user.company_id) {
    return next();
  }

  // Autoriser admin classique lié à une entreprise
  if (req.user.role === 'admin') {
    return next();
  }

  // Récupérer la company_id de la requête (correspond aux vrais champs utilisés)
  const requestedCompanyId =
    req.params.id ||
    req.body.company_id ||
    req.query.company_id;

  if (!requestedCompanyId) {
    return res.status(400).json({
      success: false,
      message: 'ID entreprise manquant dans la requête.'
    });
  }

  // Vérifier que l'utilisateur appartient à la même entreprise
  if (requestedCompanyId != req.user.company_id) {
    return res.status(403).json({
      success: false,
      message: "Accès interdit à cette entreprise."
    });
  }

  next();
}
