import { Router } from "express";
import { userLogin, userSignup } from "../controllers/user.controller";
import { validateUserSignup } from "../middlewares/validateUserSignup.middleware";


const router = Router()


router.post("/signup", validateUserSignup, userSignup)
router.post("/login", userLogin)



export default router