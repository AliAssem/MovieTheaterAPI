import { Router } from "express";
import {
  createBooking, 
  getBookingHistory, 
  cancelBooking, 
  getfreeSeats,
  postFeedback,
} from "../controllers/Customers.controller";
import { authenticate, requireRole } from "../middlewares/AuthMiddleware";  

import { validateCancelBooking, validateShowtimeId, validateNewBooking, validatefeedback } from "../middlewares/validateNewBooking.middleware";
const router = Router()

router.post("/", authenticate, requireRole("Customer"), validateNewBooking, createBooking);

router.get("/bookings-history", authenticate, requireRole("Customer"), getBookingHistory);

router.patch("/:bookingId/cancel", authenticate, requireRole("Customer"), validateCancelBooking, cancelBooking);

router.get("/showtimes/:showtimeId/free-seats", authenticate, requireRole("Customer"), validateShowtimeId, getfreeSeats);

router.post("/feedback",authenticate, requireRole("Customer"),validatefeedback,postFeedback)



export default router