import { UserService } from '../services/UserService.js';
import qs from 'qs';

const UserController = {

  async getAll(req, res) {
    try {
      const user = req.user;
      const parsedQuery = qs.parse(req._parsedUrl.query);

      // 1️⃣ ADMIN GLOBAL → voir tous les utilisateurs
      if (user.role === "admin" && user.company_id === null) {
        const users = await UserService.getAll(parsedQuery);
        return res.json({ success: true, ...users });
      }

      // 2️⃣ ADMIN ENTREPRISE / RH / MANAGER
      if (!user.company_id) {
        return res.status(403).json({
          success: false,
          message: "Entreprise introuvable"
        });
      }

      // Filtrer automatiquement par entreprise
      parsedQuery.filter = {
        ...parsedQuery.filter,
        company_id: user.company_id
      };

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
      const loggedUser = req.user;
      const body = req.body;

      // 1️⃣ ADMIN GLOBAL → peut créer pour n'importe quelle entreprise
      if (loggedUser.role === "admin" && loggedUser.company_id === null) {

        if (["employee", "rh", "manager"].includes(body.role) && !body.company_id) {
          return res.status(400).json({
            success: false,
            message: "Une entreprise est requise pour ce rôle."
          });
        }

        const user = await UserService.create(body);
        return res.status(201).json({ success: true, user });
      }

      // 2️⃣ RH / Manager / Admin entreprise
      if (!loggedUser.company_id) {
        return res.status(403).json({
          success: false,
          message: "Entreprise introuvable"
        });
      }

      body.company_id = loggedUser.company_id;

      const user = await UserService.create(body);
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
