import AuthService from '../services/AuthService.js';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken.js';

const AuthController = {
  async signup(req, res) {
    try {
      const result = await AuthService.signup(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  },

  async me(req, res) {
    try {
      const user = await AuthService.me(req.user.id);
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  logout(req, res) {
    res.json({ success: true, message: 'Déconnexion simulée' });
  },

  async refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new Error('Token de rafraîchissement requis');

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await AuthService.me(decoded.id);
    const token = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.json({ success: true, token, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(403).json({ success: false, message: 'Token invalide ou expiré' });
  }
}
};

export default AuthController;
