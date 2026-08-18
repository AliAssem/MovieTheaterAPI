/*
*** (Bookings can only be made for upcoming showtimes)=>is not done yet ***
*/ 
// Validate POST createBooking
// validates Customer, Showtime, Selected Seats, Total Price, Booking Status (Pending / Confirmed / Cancelled)
import { Request, Response, NextFunction } from 'express';
import { Users } from '../models/user.model';
import { Showtime } from '../models/showtime.model';
import {Movies} from '../models/movie.model';
export const validateNewBooking = async (req: Request, res: Response, next: NextFunction) => {
    const { customerId, showtimeId, selectedSeats, totalPrice, bookingStatus } = req.body;
    
    // check missing fields
    if (!customerId || !showtimeId || !selectedSeats || !totalPrice || !bookingStatus) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate booking status
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(bookingStatus)) {
        return res.status(400).json({ error: 'Invalid booking status' });
    }

    // Validate selected seats
    if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
        return res.status(400).json({ error: 'At least one seat must be selected' });
    }
    //check if user exists and is a customer 
    const CurrentUser = await Users.findById(customerId)
    if (CurrentUser == null || CurrentUser.role != "Customer"){
        return res.status(400).json({ error: 'Customer does not exist' });
    }
    //check if showtime exists
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
        return res.status(400).json({ error: 'Showtime does not exist' });
    }
    selectedSeats.sort()
    for(let i=0; i<selectedSeats.length; i++){
       //check if seat is valid and unique and not already booked
        if ( (selectedSeats[i][0] < 'A' || selectedSeats[i][0] > 'Z') || selectedSeats[i][2] < '0' || (selectedSeats[i][2] > '9' || selectedSeats[i][2] <'0' )){
            return res.status(400).json({ error: 'Selected seats must be valid strings' });
        }
        if(i>=1 && selectedSeats[i] ===selectedSeats[i-1]){
            return res.status(400).json({ error: 'Selected seats must be unique' });
        }
        if(showtime.seats[selectedSeats[i][0].charCodeAt(0) - 65][Number(selectedSeats[i][1]) - Number("0")]){
            return res.status(400).json({ error: `Seat ${selectedSeats[i]} is already booked` });
        }
    }
    const movie = await Movies.findById(showtime.movieId) as any;
    if(movie.status !== "Coming Soon"){
        return res.status(400).json({ error: 'Cannot book tickets for a movie that is not coming soon' });
    }
    next();
};