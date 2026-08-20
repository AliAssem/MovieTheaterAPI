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



router.post("/create", logger, authenticate, requireRole("Cinema Admin"), validateNewShowtime, createShowtime)
router.delete("/delete", logger, authenticate, requireRole("Cinema Admin"), deleteShowtime)

router.get("/", logger, authenticate, requireRole("Cinema Admin"), getallShowtimes);
router.patch("/ticket-price", logger, authenticate, requireRole("Cinema Admin"), updateTicketPrice);
router.patch("/modify", logger, authenticate, requireRole("Cinema Admin"), validateModifyShowtime, modifyShowtime);
router.put("/replace", logger, authenticate, requireRole("Cinema Admin"), validateNewShowtime, replaceShowtime)
router.get("/:showtimeId/free-seats", logger, authenticate, requireRole("Customer"), validateShowtimeId, getfreeSeats);

export default router