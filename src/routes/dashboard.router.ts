import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { authenticate, requireRole } from "../middlewares/AuthMiddleware";
import { logger } from "../middlewares/logger.middleware";

const router = Router();

/**
 * @swagger
 * /stats:
 *   get:
 *     tags: [Other]
 *     security:
 *       - bearerAuth: []
 *     summary: Returns some stats [Admin Only]
 *     responses:
 *       200:
 *         description: Returns json of some stats
 *       401:
 *         description: Unauthorized Access
 *       500:
 *         description: Server error
 */
router.get("/stats", logger, authenticate, requireRole("Cinema Admin"), getDashboardStats);

export default router;