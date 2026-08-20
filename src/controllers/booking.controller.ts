import { Request, Response } from "express";
import { Bookings } from "../models/booking.model";
import { Showtimes } from "../models/showtime.model";
import { Users } from "../models/user.model";
export const createBooking = async (req: Request, res: Response) => {
    
    try {
        const customerId = (req as any).user.Id;
        const {  showtimeId, selectedSeats } = req.body;
        const bookingStatus = "Pending"; 
        const showtime = await Showtimes.findById(showtimeId);
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
        const showtime = await Showtimes.findById(booking.showtime);
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
export const getBookingHistory = async (req: Request, res: Response) => {
    try {
        const customerId = (req as any).user.Id;
        const user = await Users.findById(customerId)
        res.status(200).json({ message: 'Booking history retrieved successfully', history: user?.history });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving booking history' });
    }
}
export const getfreeSeats = async (req: Request, res: Response) => {
    try {
        const showtimeId = req.params.showtimeId;
        const showtime = await Showtimes.findById(showtimeId);
        const freeSeats = [];
        for (let i = 0; i < 26; i++) {
            for (let j = 0; j < 10; j++) {
                if (!showtime!.seats[i][j]) {
                    freeSeats.push(`${String.fromCharCode(65 + i)}${j + 1}`);
                }
            }
        }
        res.status(200).json({ message: 'Free seats retrieved successfully', freeSeats });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving free seats' });
    }
}