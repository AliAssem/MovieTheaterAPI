import { Request, Response } from "express";
import { Bookings } from "../models/booking.model";
import { Showtime } from "../models/showtime.model";
export const createBooking = async (req: Request, res: Response) => {
    
    try {
        const customerId = (req as any).body.customerId;
        const {  showtimeId, selectedSeats, totalPrice, bookingStatus } = req.body; 
        selectedSeats.sort()
        const showtime = await Showtime.findById(showtimeId);
        for(let i=0; i<selectedSeats.length; i++){
            showtime!.seats[selectedSeats[i][0].charCodeAt(0) - 65][Number(selectedSeats[i][1]) - Number("0")] = true;
        }
    } catch (error) {
        res.status(500).json({ error: 'Error creating booking' });
    }
}