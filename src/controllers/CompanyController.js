import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import CompanyService from '../services/CompanyService.js';
import emailService from '../services/emailService.js'; // ← ajoute si tu as un service email

const prisma = new PrismaClient();

const CompanyController = {

  /* -------------------------------------------
     PUBLIC REGISTRATION (PAS D'AUTH REQUIRED)
     POST /api/companies/public-register
  ------------------------------------------- */
  async publicRegister(req, res) {
    try {
      const { name, email, password, admin_email, address, siret } = req.body;

      if (!name || !email || !admin_email || !password) {
        return res.status(400).json({
          success: false,
          message: "Champs requis : name, email, admin_email, password"
        });
      }

      // Vérifier si l’entreprise existe déjà
      const existing = await prisma.companies.findFirst({
        where: { email }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Cette entreprise existe déjà."
        });
      }

      // 1️⃣ Créer l’entreprise
      const company = await prisma.companies.create({
        data: {
          name,
          email,
          address: address || "Non renseignée",
          siret: siret || null
        }
      });

      // 2️⃣ Créer l’admin
      const hashedPassword = await bcrypt.hash(password, 10);
      const activationToken = crypto.randomUUID();

      const adminUser = await prisma.users.create({
        data: {
          email: admin_email,
          password_hash: hashedPassword,
          role: "admin",
          company_id: company.id,
          activation_token: activationToken,
          email_verified: false
        }
      });

      // 3️⃣ Envoyer emails
      try {
        await emailService.sendWelcomeEmail(admin_email, name);
        await emailService.sendActivationEmail(admin_email, activationToken);
      } catch (mailErr) {
        console.warn("⚠️ Email non envoyé :", mailErr.message);
      }

      // 4️⃣ Créer abonnement TRIAL (14 j)
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 14);

      const subscription = await prisma.subscriptions.create({
        data: {
          company_id: company.id,
          plan: "trial",
          status: "active",
          billing_cycle: "trial",
          start_date: start,
          end_date: end
        }
      });

      return res.json({
        success: true,
        message: "Entreprise créée, admin créé, emails envoyés, trial activé",
        company,
        admin: adminUser,
        subscription
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  /* -------------------------------------------
     ADMIN ONLY (EXISTANTS)
  ------------------------------------------- */

  async index(req, res) {
    try {
      const companies = await CompanyService.getAll(req.query);
      return res.json({ success: true, ...companies });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  async show(req, res) {
    try {
      const company = await CompanyService.getById(req.params.id);

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Entreprise non trouvée"
        });
      }

      return res.json({ success: true, data: company });

    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  async create(req, res) {
    try {
      const company = await CompanyService.create(req.body);
      return res.status(201).json({ success: true, data: company });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
  },

  async update(req, res) {
    try {
      const company = await CompanyService.update(req.params.id, req.body);
      return res.json({ success: true, data: company });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
  },

  async delete(req, res) {
    try {
      await CompanyService.remove(req.params.id);
      return res.json({ success: true, message: "Entreprise supprimée" });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }
};

export default CompanyController;
