import { Router } from "express";
import { logger } from "../middlewares/logger.middleware";
import { authenticate, requireRole } from "../middlewares/AuthMiddleware";
import { validateNewShowtime } from "../middlewares/validateNewShowtime.middleware";
import { createShowtime, deleteShowtime } from "../controllers/showtime.controller";
import { validateShowtimeId } from "../middlewares/validateNewBooking.middleware";
import { getfreeSeats } from "../controllers/booking.controller";


const router = Router()



router.post("/create", logger, authenticate, requireRole("Cinema Admin"), validateNewShowtime, createShowtime)
router.delete("/delete", logger, authenticate, requireRole("Cinema Admin"), deleteShowtime)

router.get("/:showtimeId/free-seats", logger, authenticate, requireRole("Customer"), validateShowtimeId, getfreeSeats);


export default router