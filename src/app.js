import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import companyRoutes from './routes/companies.js';
import userRoutes from './routes/users.js';
import subscriptionRoutes from './routes/subscriptions.js';
import settingsRoutes from './routes/settings.js';

import authMiddleware from './middlewares/authMiddleware.js';
import blockIfNoSubscription  from './middlewares/blockIfNoSubscription.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 🚀 PUBLIC ROUTES (pas de blocage abonnement)
app.use('/api/auth', authRoutes);
app.use('/api/companies/public-register', companyRoutes);

// 🚧 Toutes les routes suivantes nécessitent AUTH + abonnement actif
app.use('/api', authMiddleware, blockIfNoSubscription);

// ROUTES PROTÉGÉES
app.use('/api/companies', companyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/settings', settingsRoutes);

// 🔁 Ping healthcheck
app.get('/', (req, res) => {
  res.send('✅ API en ligne');
});

// 🚀 Lancer serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
