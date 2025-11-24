import { SettingsService } from '../services/SettingsService';

const SettingsController = {

  async get(req, res) {
    try {
      const settings = await SettingsService.getAll();
      res.json({ success: true, data: settings });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { category, settings } = req.body;
      const userId = req.user.id;

      if (!category || !settings) {
        return res.status(400).json({
          success: false,
          message: "category et settings sont requis"
        });
      }

      const updated = await SettingsService.update(category, settings, userId);

      // (optionnel) audit log
      console.log("UPDATE_SETTINGS", { userId, category });

      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

};

export default SettingsController;
