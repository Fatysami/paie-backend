import CompanySettingsService from "../services/CompanySettingsService.js";

class CompanySettingsController {
  async getCompany(req, res) {
    try {
      const { companyId } = req.params;

      const company = await CompanySettingsService.getCompany(companyId);

      return res.json(company);
    } catch (error) {
      return res.status(404).json({
        message: error.message,
      });
    }
  }

  async updateCompany(req, res) {
    try {
      const { companyId } = req.params;
      const data = req.body;

      const updatedCompany = await CompanySettingsService.updateCompany(
        companyId,
        data
      );

      return res.json(updatedCompany);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
}

export default new CompanySettingsController();
