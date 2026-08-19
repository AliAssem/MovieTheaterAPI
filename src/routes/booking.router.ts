import { Router } from "express";
import {
  createBooking, 
  cancelBooking
  // getMyBookings, 
  // getAllBookings
} from "../controllers/booking.controller";
import { authenticate, requireRole } from "../middlewares/AuthMiddleware";  

import { validateNewBooking } from "../middlewares/validateNewBooking.middleware";
const router = Router()

router.post("/", authenticate, requireRole("Customer"), validateNewBooking, createBooking);

// router.get("/my-bookings", authenticate, requireRole("Customer"), getMyBookings);

router.patch("/:bookingId/cancel", authenticate, requireRole("Customer"), cancelBooking);

// router.get("/", authenticate, requireRole("Cinema Admin"), getAllBookings);





export default router