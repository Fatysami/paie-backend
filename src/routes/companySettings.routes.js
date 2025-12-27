import express from "express";
import CompanySettingsController from "../controllers/CompanySettingsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router({ mergeParams: true });

/**
 * GET infos société
 * Roles: admin, rh, manager
 */
router.get(
  "/company",
  authMiddleware,
  roleMiddleware(["admin", "rh", "manager"]),
  CompanySettingsController.getCompany
);

/**
 * UPDATE infos société
 * Role: admin seulement
 */
router.put(
  "/company",
  authMiddleware,
  roleMiddleware(["admin"]),
  CompanySettingsController.updateCompany
);

export default router;
