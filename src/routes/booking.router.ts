import { Router } from "express";
import {
  createBooking, 
  getBookingHistory, 
  cancelBooking, 
  getfreeSeats
} from "../controllers/booking.controller";
import { authenticate, authorize } from "../middlewares/AuthMiddleware";  

import { validateCancelBooking, validategetfreeSeats, validateNewBooking } from "../middlewares/validateNewBooking.middleware";
const router = Router()

router.post("/", authenticate, authorize("Customer"), validateNewBooking, createBooking);

router.get("/bookings-history", authenticate, authorize("Customer"), getBookingHistory);

router.patch("/:bookingId/cancel", authenticate, authorize("Customer"), validateCancelBooking, cancelBooking);

router.get("/showtimes/:showtimeId/free-seats", authenticate, authorize("Customer"), validategetfreeSeats, getfreeSeats);





export default router