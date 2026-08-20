import { Router } from "express";
import { logger } from "../middlewares/logger.middleware";
import { authenticate, requireRole } from "../middlewares/AuthMiddleware";
import { validateNewShowtime } from "../middlewares/validateNewShowtime.middleware";
import { createShowtime, deleteShowtime, updateTicketPrice } from "../controllers/showtime.controller";
import { validateShowtimeId } from "../middlewares/validateNewBooking.middleware";
import { getfreeSeats } from "../controllers/Customers.controller";
import { getallShowtimes } from "../controllers/showtime.controller";


const router = Router()



router.post("/create", logger, authenticate, requireRole("Cinema Admin"), validateNewShowtime, createShowtime)
router.delete("/delete", logger, authenticate, requireRole("Cinema Admin"), deleteShowtime)

router.get("/:showtimeId/free-seats", logger, authenticate, requireRole("Customer"), validateShowtimeId, getfreeSeats);
router.get("/", logger, authenticate, requireRole("Cinema Admin"), getallShowtimes);
router.patch("/ticket-price", logger, authenticate, requireRole("Cinema Admin"), updateTicketPrice);

export default router