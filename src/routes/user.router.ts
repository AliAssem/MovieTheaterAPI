import { Router } from "express";
import { promoteUser, userLogin, userSignup } from "../controllers/user.controller";
import { validateUserSignup } from "../middlewares/validateUserSignup.middleware";
import { logger } from "../middlewares/logger.middleware";
import { authenticate, requireRole } from "../middlewares/AuthMiddleware";


const router = Router()


router.post("/signup", logger, validateUserSignup, userSignup)
router.post("/login", logger, userLogin)
router.post("/promote", logger, authenticate, requireRole("Cinema Admin"), promoteUser)



export default router