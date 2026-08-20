import { Router } from "express";
import { userLogin, userSignup } from "../controllers/user.controller";
import { validateUserSignup } from "../middlewares/validateUserSignup.middleware";
import { logger } from "../middlewares/logger.middleware";


const router = Router()


router.post("/signup", logger, validateUserSignup, userSignup)
router.post("/login", logger, userLogin)



export default router