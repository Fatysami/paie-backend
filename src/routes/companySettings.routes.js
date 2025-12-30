import express from "express";
import CompanySettingsController from "../controllers/CompanySettingsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { companyOnly } from "../middlewares/companyOnly.js";
import adminOnly from "../middlewares/adminOnly.js";
import { managerOrAdmin } from "../middlewares/managerOrAdmin.js";


const router = express.Router({ mergeParams: true });

/**
 * GET infos société
 * Roles: admin, rh, manager
 */
router.get(
  "/company",
  authMiddleware,
  companyOnly,
  managerOrAdmin,
  CompanySettingsController.getCompany
);

/**
 * UPDATE infos société
 * admin uniquement
 */
router.put(
  "/company",
  authMiddleware,
  companyOnly,
  adminOnly,
  CompanySettingsController.updateCompany
);

export default router;
