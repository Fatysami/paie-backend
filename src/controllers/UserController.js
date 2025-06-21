import { UserService } from '../services/UserService.js';
import qs from 'qs'; // à ajouter en haut

const UserController = {
  async getAll(req, res) {
  try {
    const parsedQuery = qs.parse(req._parsedUrl.query); // parse manuellement l'URL
    const users = await UserService.getAll(parsedQuery);
    res.json({ success: true, ...users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
},

  async getById(req, res) {
    try {
      const user = await UserService.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getByCompany(req, res) {
    try {
      const users = await UserService.findByCompany(req.params.id);
      res.json({ success: true, users });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async create(req, res) {
    try {
      const user = await UserService.create(req.body);
      res.status(201).json({ success: true, user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const user = await UserService.update(req.params.id, req.body);
      res.json({ success: true, user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      await UserService.remove(req.params.id);
      res.json({ success: true, message: 'Utilisateur supprimé' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};

export default UserController;
