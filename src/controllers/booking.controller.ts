import { Request, Response } from "express";
import { Bookings } from "../models/booking.model";
import { Showtime } from "../models/showtime.model";
import { Users } from "../models/user.model";
export const createBooking = async (req: Request, res: Response) => {
    
    try {
        const customerId = (req as any).user.Id;
        const {  showtimeId, selectedSeats } = req.body;
        const bookingStatus = "Pending"; 
        const showtime = await Showtime.findById(showtimeId);
        const totalPrice = selectedSeats.length * showtime!.ticketPrice;
        selectedSeats.sort()
        for(let i=0; i<selectedSeats.length; i++){
            showtime!.seats[selectedSeats[i][0].charCodeAt(0) - 65][Number(selectedSeats[i][1]) - Number("0")] = true;
        }
        await showtime?.save()
        const newBooking = await Bookings.create({
            customer: customerId,
            showtime: showtimeId,
            selectedSeats,
            totalPrice,
            bookingStatus
        });
        await Users.findByIdAndUpdate(customerId, { $push: { history: { showtimeId, booked_seats: selectedSeats } } });
        res.status(201).json({
            message: 'Booking created successfully',
            newBooking
        });
    } catch (error) {
        res.status(500).json({ error: 'Error creating booking' });
    }
}

export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = req.body.bookingId;
        const booking = await Bookings.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        const showtime = await Showtime.findById(booking.showtime);
        if (!showtime) {
            return res.status(404).json({ error: 'Showtime not found' });
        }
        for (let i = 0; i < booking.selectedSeats.length; i++) {
            showtime.seats[booking.selectedSeats[i][0].charCodeAt(0) - 65][Number(booking.selectedSeats[i][1]) - Number("0")] = false;
        }        
        showtime.save();
        booking.bookingStatus = "Cancelled";
        await booking.save();
        res.status(200).json({ message: 'Booking cancelled successfully' });
    }catch (error) {
        res.status(500).json({ error: 'Error cancelling booking' });
    }
}