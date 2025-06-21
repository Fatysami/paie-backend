import CompanyService from '../services/CompanyService.js';

const CompanyController = {
  async index(req, res) {
  try {
    const companies = await CompanyService.getAll(req.query);
    res.json({ success: true, ...companies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
},

  async show(req, res) {
    const company = await CompanyService.getById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Entreprise non trouvée' });
    res.json({ success: true, data: company });
  },

  async create(req, res) {
    const company = await CompanyService.create(req.body);
    res.status(201).json({ success: true, data: company });
  },

  async update(req, res) {
    const company = await CompanyService.update(req.params.id, req.body);
    res.json({ success: true, data: company });
  },

  async delete(req, res) {
    await CompanyService.remove(req.params.id);
    res.json({ success: true, message: 'Entreprise supprimée' });
  }
};

export default CompanyController;
