import { Router } from "express";
import {
  createBooking, 
  getMyBookings, 
  cancelBooking, 
  getAllBookings
} from "../controllers/booking.controller";
import { authenticate, authorize } from "../middlewares/AuthMiddleware";  

import { validateNewBooking } from "../middlewares/validateNewBooking.middleware";
const router = Router()

router.post("/", authenticate, authorize("Customer"), validateNewBooking, createBooking);

router.get("/my-bookings", authenticate, authorize("Customer"), getMyBookings);

router.patch("/:bookingId/cancel", authenticate, authorize("Customer"), cancelBooking);

router.get("/", authenticate, authorize("Cinema Admin"), getAllBookings);





export default router