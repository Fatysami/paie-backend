import { UserService } from '../services/UserService.js';
import qs from 'qs';

const UserController = {

  // 📌 GET /api/users
  async getAll(req, res) {
  try {
    const user = req.user;
    const parsedQuery = qs.parse(req._parsedUrl.query);

    // 1️⃣ ADMIN GLOBAL → voir tous les utilisateurs
    if (user.role === "admin" && user.company_id === null) {
      const users = await UserService.getAll(parsedQuery);
      return res.json({ success: true, ...users });
    }

    // 2️⃣ ADMIN ENTREPRISE / RH / MANAGER → filtrage par leur entreprise
    if (!user.company_id) {
      return res.status(403).json({
        success: false,
        message: "Entreprise introuvable"
      });
    }

    // Injecter automatiquement company_id dans le filtre
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


  // 📌 GET /api/users/:id
  async getById(req, res) {
    try {
      const user = await UserService.findById(req.params.id);
      if (!user)
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  // 📌 GET /api/users/company/:id
  async getByCompany(req, res) {
    try {
      const users = await UserService.findByCompany(req.params.id);
      res.json({ success: true, users });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },


  // 📌 POST /api/users
  async create(req, res) {
    try {
      const loggedUser = req.user;
      const body = req.body;

      // 1️⃣ ADMIN GLOBAL
      if (loggedUser.role === 'admin' && loggedUser.company_id === null) {
        // mais les employés DOIVENT avoir une entreprise
        if (['employee', 'rh', 'manager'].includes(body.role) && !body.company_id) {
          return res.status(400).json({
            success: false,
            message: "Une entreprise est requise pour ce rôle."
          });
        }

        const user = await UserService.create(body);
        return res.status(201).json({ success: true, user });
      }

      // 2️⃣ RH / ADMIN ENTREPRISE / MANAGER
      if (!loggedUser.company_id) {
        return res.status(403).json({
          success: false,
          message: "Entreprise introuvable"
        });
      }

      // Forcer l’entreprise
      body.company_id = loggedUser.company_id;

      const user = await UserService.create(body);
      res.status(201).json({ success: true, user });

    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },


  // 📌 PUT /api/users/:id
  async update(req, res) {
    try {
      const user = await UserService.update(req.params.id, req.body);
      res.json({ success: true, user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },


  // 📌 DELETE /api/users/:id
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
