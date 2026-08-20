// Validate POST createBooking
// validates Customer, Showtime, Selected Seats, Total Price, Booking Status (Pending / Confirmed / Cancelled)
import { Request, Response, NextFunction } from 'express';
import { Users } from '../models/user.model';
import { Showtimes } from '../models/showtime.model';
import {Movies} from '../models/movie.model';
import { Bookings } from '../models/booking.model';
export const validateNewBooking = async (req: Request, res: Response, next: NextFunction) => {
    const customerId = (req as any).user.Id;
    const { showtimeId, selectedSeats } = req.body;
    const bookingStatus = "Pending";    
    // check missing fields
    if (!customerId || !showtimeId || !selectedSeats || !bookingStatus) {
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
    const showtime = await Showtimes.findById(showtimeId);
    if (!showtime) {
        return res.status(400).json({ error: 'Showtime does not exist' });
    }
    selectedSeats.sort()
    for(let i=0; i<selectedSeats.length; i++){
       //check if seat is valid and unique and not already booked
       if(selectedSeats[i].length !== 2){
            return res.status(400).json({ error: 'Selected seats must be valid strings' });
        }
        if ( (selectedSeats[i][0] < 'A' || selectedSeats[i][0] > 'Z') || selectedSeats[i][1] < '0' || (selectedSeats[i][1] > '9' )){
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
    if(Date.now() >= new Date(showtime.date).getTime()){
        return res.status(400).json({ error: 'Cannot book tickets for a showtime that has already passed' });
    }
    if(movie.status === "Coming Soon"){
        return res.status(400).json({ error: 'Cannot book tickets for a movie that is coming soon' });
    }
    next();
};

//
export const validateCancelBooking = async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId;
    if (!bookingId) {
        return res.status(400).json({ error: 'Booking ID is required' });
    }
    const current_user= await Users.findById((req as any).user.Id)
    const booking = await Bookings.findById(bookingId);
    if (!current_user) {
    return res.status(401).json({ error: 'User not found' });
    }
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    if (current_user?.role === 'Customer' && booking.customer.toString() !== current_user.id.toString()) {
        return res.status(403).json({ error: 'You are not authorized to cancel this booking' });
    }
    const showtime = await Showtimes.findById(booking.showtime);
    if (!showtime) {
        return res.status(404).json({ error: 'Associated showtime not found' });
    }

    const showDateTime = new Date(showtime.date);
    showDateTime.setMinutes(showDateTime.getMinutes() + Number(showtime.startTime));

    if (Date.now() >= showDateTime.getTime()) {
        return res.status(400).json({ error: 'Cannot cancel a booking after the showtime has started' });
    }
    if (booking.bookingStatus === 'Cancelled') {
    return res.status(400).json({ error: 'Booking is already cancelled' });
    }
    next();
};
export const validateShowtimeId = async (req: Request, res: Response, next: NextFunction) => {
    const showtimeId = req.params.showtimeId;   

    if (!showtimeId) {
        return res.status(400).json({ error: 'Showtime ID is required' });
    }
    if (!await Showtimes.findById(showtimeId)) {
        return res.status(404).json({ error: 'Showtime not found' });
    }
    next();
};
export const validatefeedback=async(req:Request,res:Response,next:NextFunction)=>{
    const customerId = (req as any).user.Id;
    const { showtimeId, feedback, rate } = req.body;
    if(!showtimeId||!feedback||!rate){
         return res.status(400).json({ error: 'All fields are required' });
    }
    const showtime=await Showtimes.findById(showtimeId)
    if(!showtime){
        return res.status(400).json({ error: 'Showtime does not exist' });
    }
    const showDateTime = new Date(showtime.date);
    if(Date.now() < showDateTime.getTime()){
        return res.status(400).json({ error: 'Cannot let feedback before the show ends' });
    }
    if(rate<0||rate>10)
        return res.status(400).json({ error: 'rate must be between 0-10' });
    const user=await Users.findById(customerId)
    if(user?.role!=="Customer")
        return res.status(400).json({ error: 'Only customers can let feedback' });
   const hasWatched = user?.history?.find((record: any) => record.showtimeId.toString() === showtimeId);
    if (!hasWatched) {
        return res.status(400).json({ error: 'You cannot rate a movie you did not watch' });
    }
 next();
}