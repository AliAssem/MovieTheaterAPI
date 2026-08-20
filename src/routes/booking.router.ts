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

router.post("/", logger, authenticate, requireRole("Customer"), validateNewBooking, createBooking);

router.get("/bookings-history", logger, authenticate, requireRole("Customer"), getBookingHistory);



router.post("/feedback",authenticate, requireRole("Customer"),validatefeedback,postFeedback)

router.post("/confirm", authenticate, requireRole("Cinema Admin"), confirmBookingPayment)

router.patch("/:bookingId/cancel", logger, authenticate, requireRole("Customer"), validateCancelBooking, cancelBooking);



export default router