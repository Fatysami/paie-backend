import SubscriptionService from '../services/SubscriptionService.js';

export const SubscriptionController = {
 async getAll(req, res) {
    try {
      const result = await SubscriptionService.getAll(req.query);
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getByCompany(req, res) {
    try {
      const { id } = req.params;
      const subs = await SubscriptionService.getByCompany(id);
      res.json({ success: true, subscriptions: subs });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async create(req, res) {
    try {
      const sub = await SubscriptionService.create(req.body);
      res.status(201).json({ success: true, subscription: sub });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await SubscriptionService.update(id, req.body);
      res.json({ success: true, subscription: updated });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      await SubscriptionService.remove(id);
      res.json({ success: true, message: 'Abonnement supprimé.' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
};