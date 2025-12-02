import CompanyService from '../services/CompanyService.js';

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

    // Vérifier si entreprise existe déjà
    const existing = await prisma.companies.findFirst({
      where: { email }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Cette entreprise existe déjà."
      });
    }

    // 1️⃣ Créer entreprise
    const company = await prisma.companies.create({
      data: {
        name,
        email,
        address: address || "Non renseignée",
        siret: siret || null
      }
    });

    // 2️⃣ Créer admin
    const hashed = await bcrypt.hash(password, 10);
    const activationToken = crypto.randomUUID();

    const adminUser = await prisma.users.create({
      data: {
        email: admin_email,
        password_hash: hashed,
        role: "admin",
        company_id: company.id,
        activation_token: activationToken,
        email_verified: false
      }
    });

    // 3️⃣ Envoyer emails
    await emailService.sendWelcomeEmail(admin_email, name);
    await emailService.sendActivationEmail(admin_email, activationToken);

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

    res.json({
      success: true,
      message: "Entreprise créée, admin créé, mail envoyé, trial activé",
      company,
      admin: adminUser,
      subscription
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
},

  /* -------------------------------------------
     ADMIN ONLY (EXISTANTS)
  ------------------------------------------- */



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
