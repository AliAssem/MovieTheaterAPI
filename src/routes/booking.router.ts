import { Router } from "express";
import {
  createBooking, 
  getBookingHistory, 
  cancelBooking, 
} from "../controllers/booking.controller";
import { authenticate, requireRole } from "../middlewares/AuthMiddleware";  

import { validateCancelBooking, validateNewBooking } from "../middlewares/validateNewBooking.middleware";
import { logger } from "../middlewares/logger.middleware";
const router = Router()

router.post("/", logger, authenticate, requireRole("Customer"), validateNewBooking, createBooking);

router.get("/bookings-history", logger, authenticate, requireRole("Customer"), getBookingHistory);

router.patch("/:bookingId/cancel", logger, authenticate, requireRole("Customer"), validateCancelBooking, cancelBooking);






export default router