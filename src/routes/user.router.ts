import { Router } from "express";
import { promoteUser, userLogin, userSignup } from "../controllers/user.controller";
import { validateUserSignup } from "../middlewares/validateUserSignup.middleware";
import { logger } from "../middlewares/logger.middleware";
import { authenticate, requireRole } from "../middlewares/AuthMiddleware";


const router = Router()

/**
 * @swagger
 * /users/signup:
 *   post:
 *     tags: [Account]
 *     summary: Register a new account
 *     parameters:
 * 
 * 
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 description: The email for the new account
 *               password:
 *                 type: string
 *                 description: The password for the new account (length between 8 and 20 / must contain atleast 1 special char and 1 uppercase letter)
 *     responses:
 *       201:
 *         description: Account created successfully (returns JWT token)
 *       401:
 *         description: Email already linked to an account
 *       500:
 *         description: Server error
 */
router.post("/signup", logger, validateUserSignup, userSignup)
/**
 * @swagger
 * /users/login:
 *   post:
 *     tags: [Account]
 *     summary: Login into an existing account
 *     parameters:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email linked to the account
 *               password:
 *                 type: string
 *                 description: The password of the account
 *     responses:
 *       200:
 *         description: Login successfull (returns JWT token)
 *       404:
 *         description: Email not linked to an account
 *       401:
 *         description: Incorrect password
 *       500:
 *         description: Server error
 */
router.post("/login", logger, userLogin)
/**
 * @swagger
 * /users/promote:
 *   post:
 *     tags: [Account]
 *     summary: Change an account's role [ADMIN]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: _id
 *         required: true
 *         description: The ID of the user to change
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [Customer, Cinema Admin]
 *         required: true
 *         description: The new role to assign to the user
 * 
 * 
 *     responses:
 *       200:
 *         description: Account role changed successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/promote", logger, authenticate, requireRole("Cinema Admin"), promoteUser)



export default router