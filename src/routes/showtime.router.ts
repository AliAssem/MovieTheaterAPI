import { Router } from "express";
import { logger } from "../middlewares/logger.middleware";
import { authenticate, requireRole } from "../middlewares/AuthMiddleware";
import { validateNewShowtime } from "../middlewares/validateNewShowtime.middleware";
import { createShowtime, deleteShowtime } from "../controllers/showtime.controller";


const router = Router()



router.post("/create", logger, authenticate, requireRole("Cinema Admin"), validateNewShowtime, createShowtime)
router.delete("/delete", logger, authenticate, requireRole("Cinema Admin"), deleteShowtime)



export default router