import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { authenticate, requireRole } from "../middlewares/AuthMiddleware";

const router = Router();

// Remember to add your middlewares before the controller!
// Example: router.get("/stats", verifyToken, isAdmin, getDashboardStats);
router.get("/stats", authenticate, requireRole("Cinema Admin"), getDashboardStats);

export default router;