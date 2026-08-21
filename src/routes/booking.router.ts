import { Router } from "express";
import {
  createBooking, 
  getBookingHistory, 
  cancelBooking, 
  postFeedback,
  confirmBookingPayment
} from "../controllers/Customers.controller";
import { authenticate, requireRole } from "../middlewares/AuthMiddleware";  

import { validateCancelBooking, validateNewBooking, validatefeedback } from "../middlewares/validateNewBooking.middleware";
import { logger } from "../middlewares/logger.middleware";
const router = Router()

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Endpoints for managing ticket bookings and payment confirmation
 */

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Create a new ticket booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - showtimeId
 *               - seats
 *             properties:
 *               showtimeId:
 *                 type: string
 *                 example: "66b1c8f4e2a123456789abcd"
 *               seats:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["A1", "A2"]
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid input or selected seats are unavailable
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Requires Customer role
 *       500:
 *         description: Internal server error
 */

router.post("/", logger, authenticate, requireRole("Customer"), validateNewBooking, createBooking);

/**
 * @swagger
 * /api/v1/bookings/bookings-history:
 *   get:
 *     summary: Retrieve user's booking history
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched booking history
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Requires Customer role
 *       500:
 *         description: Internal server error
 */

router.get("/bookings-history", logger, authenticate, requireRole("Customer"), getBookingHistory);

/**
 * @swagger
 * /api/v1/bookings/cancel/{bookingId}:
 *   patch:
 *     summary: Cancel a booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the booking to cancel
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Invalid booking ID or cancellation window expired
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Requires Customer role
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

router.patch("/cancel/:bookingId", logger, authenticate, requireRole("Customer"), validateCancelBooking, cancelBooking);

/**
 * @swagger
 * /api/v1/bookings/confirm:
 *   post:
 *     summary: Confirm booking payment (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: "66b1c8f4e2a123456789abcd"
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       400:
 *         description: Invalid booking ID or payment already confirmed
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Requires Cinema Admin role
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

router.post("/confirm", authenticate, requireRole("Cinema Admin"), confirmBookingPayment)

// router.patch("/:bookingId/cancel", logger, authenticate, requireRole("Customer"), validateCancelBooking, cancelBooking);



export default router