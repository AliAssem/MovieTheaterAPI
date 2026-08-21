import { Router } from "express";
import { logger } from "../middlewares/logger.middleware";
import { authenticate, requireRole } from "../middlewares/AuthMiddleware";
import { validateModifyShowtime, validateNewShowtime } from "../middlewares/validateNewShowtime.middleware";
import {
    createShowtime,
    deleteShowtime,
    modifyShowtime,
    replaceShowtime,
    updateTicketPrice
} from "../controllers/showtime.controller";
import { validateShowtimeId } from "../middlewares/validateNewBooking.middleware";
import { getfreeSeats } from "../controllers/Customers.controller";
import { getallShowtimes } from "../controllers/showtime.controller";


const router = Router()

/**
 * @swagger
 * tags:
 *   name: Showtimes
 *   description: Management of cinema movie showtimes and seat availability
 */

/**
 * @swagger
 * /showtimes:
 *   get:
 *     summary: Retrieve all showtimes (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched all showtimes with populated movie details
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Requires Cinema Admin role
 *       500:
 *         description: Internal server error
 */




router.get("/", logger, authenticate, requireRole("Cinema Admin"), getallShowtimes);
/**
 * @swagger
 * /showtimes/create:
 *   post:
 *     summary: Create a new showtime (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - startTime
 *               - ticketPrice
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: "66b1c8f4e2a123456789abcd"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-09-01T18:00:00.000Z"
 *               ticketPrice:
 *                 type: number
 *                 example: 120
 *     responses:
 *       201:
 *         description: Showtime created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires Cinema Admin role
 *       500:
 *         description: Internal server error
 */

router.post("/create", logger, authenticate, requireRole("Cinema Admin"), validateNewShowtime, createShowtime)

/**
 * @swagger
 * /showtimes/ticket-price:
 *   patch:
 *     summary: Update ticket price for a showtime (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Showtime ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketPrice
 *             properties:
 *               ticketPrice:
 *                 type: number
 *                 example: 150
 *     responses:
 *       200:
 *         description: Ticket price updated successfully
 *       400:
 *         description: Invalid price or missing parameter
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Internal server error
*/

router.patch("/ticket-price", logger, authenticate, requireRole("Cinema Admin"), updateTicketPrice);

/**
 * @swagger
 * /showtimes/modify:
 *   patch:
 *     summary: Partially modify showtime details (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               ticketPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Showtime modified successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Internal server error
 */

router.patch("/modify", logger, authenticate, requireRole("Cinema Admin"), validateModifyShowtime, modifyShowtime);

/**
 * @swagger
 * /showtimes/replace:
 *   put:
 *     summary: Replace entire showtime object (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *               - startTime
 *               - ticketPrice
 *             properties:
 *               movieId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               ticketPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Showtime replaced successfully
 *       400:
 *         description: Invalid payload
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Internal server error
 */

router.put("/replace", logger, authenticate, requireRole("Cinema Admin"), validateNewShowtime, replaceShowtime)

/**
 * @swagger
 * /showtimes/delete:
 *   delete:
 *     summary: Delete a showtime (Admin only)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Showtime ID to delete
 *     responses:
 *       200:
 *         description: Showtime deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Internal server error
 */

router.delete("/delete", logger, authenticate, requireRole("Cinema Admin"), deleteShowtime)
/**
 * @swagger
 * /showtimes/{showtimeId}/free-seats:
 *   get:
 *     summary: Get list of available free seats for a showtime
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: showtimeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Target showtime ID
 *     responses:
 *       200:
 *         description: List of available seats retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Showtime not found
 *       500:
 *         description: Internal server error
 */

router.get("/:showtimeId/free-seats", logger, authenticate, requireRole("Customer"), validateShowtimeId, getfreeSeats);

export default router