import { Request, Response } from "express";
import { Bookings } from "../models/booking.model";
import { Showtimes } from "../models/showtime.model";
import { Users } from "../models/user.model";
import { Movie, Movies } from "../models/movie.model";
import { AuthRequest } from "../middlewares/AuthMiddleware";
export const createBooking = async (req: Request, res: Response) => {
    
    try {
        const customerId = (req as any).user.id;
        const {  showtimeId, selectedSeats } = req.body;
        const bookingStatus = "Pending"; 
        const showtime = await Showtimes.findById(showtimeId);
        const totalPrice = selectedSeats.length * showtime!.ticketPrice;
        selectedSeats.sort()
        for(let i=0; i<selectedSeats.length; i++){
            showtime!.seats[selectedSeats[i][0].charCodeAt(0) - 65][Number(selectedSeats[i][1]) - 1] = true;
        }
        await showtime?.save()
        const newBooking = await Bookings.create({
            customer: customerId,
            showtime: showtimeId,
            selectedSeats,
            totalPrice,
            bookingStatus
        });
        await Users.findByIdAndUpdate(customerId, { $push: { history: { _id: newBooking._id,showtimeId, booked_seats: selectedSeats } } });
        res.status(201).json({
            message: 'Booking created successfully',
            newBooking
        });
    } catch (error) {
        res.status(500).json({ error: 'Error creating booking' });
    }
}

export const cancelBooking = async (req: AuthRequest, res: Response) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Bookings.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if(req.user.id !== booking.customer) return res.status(403).send({message: `Forbidden: cannot cancel another customers booking`});

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
        const customerId = (req as any).user.id;
        const user = await Users.findById(customerId)
        if(user?.history?.length===0)
        return res.status(200).json({ message: 'Booking history retrieved successfully but it is empty'});    
        res.status(200).json({ message: 'Booking history retrieved successfully', history: user?.history });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving booking history' });
    }
}
export const getfreeSeats = async (req: Request, res: Response) => {
    try {
        const showtimeId = req.params.showtimeId;
        const showtime = await Showtimes.findById(showtimeId);

        if(!showtime) return res.status(404).send({message: `Showtime not found`});

        const freeSeats = [];
        for (let i = 0; i < showtime.rows; i++) {
            for (let j = 0; j < showtime.columns; j++) {
                if (!showtime!.seats[i][j] && showtime.seats[i][j]) {
                    freeSeats.push(`${String.fromCharCode(65 + i)}${j + 1}`);
                }
            }
        }
        if(freeSeats.length === 0){
            return res.status(404).json({ error: 'No free seats available for this showtime' });
        }
        else 
        res.status(200).json({ message: 'Free seats retrieved successfully', freeSeats });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving free seats' });
    }
}
export const postFeedback = async (req: Request, res: Response) => {
    try {
        const customerId = (req as any).user.Id;
        const { showtimeId, feedback, rate } = req.body;
        const user = await Users.findById(customerId);
        const showtime = await Showtimes.findById(showtimeId);
        const movie = await Movies.findById(showtime?.movieId);
        movie!.ratingSum += rate;
        movie!.ratingCount += 1;
        movie!.rating = movie!.ratingSum / movie!.ratingCount;
        await movie?.save();
        user!.feedback!.push({ showtimeId, comment: feedback, rate });
        await user!.save();
      await Movies.findByIdAndUpdate(movie?._id, { 
    $push: { 
        feedback: { customer: customerId, feedback: feedback, rate }
    } 
});
        res.status(200).json({ message: 'Feedback submitted successfully' });
    }catch (error) {
        res.status(500).json({ error: 'Error submitting feedback' });
    }
}
const browseShowtimes = async (req: Request, res: Response) => {
    try{
        const { movieId, date, hallNumber } = req.query;
        let filterQuery: any = {};


        if (movieId) filterQuery.movie = movieId;
        
        if (date) filterQuery.date = date;

        if (hallNumber) filterQuery.hallNumber = hallNumber;

        const showtimes = await Showtimes.find(filterQuery).populate("movie", "title posterUrl duration rating");

        res.status(200).send(showtimes);
    } catch {
        res.status(500).send({ message: "Server error while fetching showtimes" });
    }
}
export const addfavorite= async (req: Request, res: Response) =>{
   try{
    const customerId = (req as any).user.id;
    const {movieId}=req.params
    const movie=await Movies.findById(movieId)
    if(!movie)
        return res.status(400).json({ message: "Movie not found" })
    const updateduser=await Users.findByIdAndUpdate(customerId, { $addToSet: { favorite: movieId } },
      { new: true }
    );

    res.status(200).json({message: "Movie added to favorites successfully",favorite:updateduser!.favorite!}) 
}
catch(error){
    return res.status(500).json({ error: "Error adding movie to favorites" });
}
}

export const getfavorite= async (req:Request,res:Response)=>{
    try{
    let favoriteArray:Movie[]=[]
    const customerId = (req as any).user.id;
    const user = await Users.findById(customerId)
    for(let i=0;i<user!.favorite!.length;i++){
        const favMovie= await Movies.findById(user?.favorite[i]);
        favoriteArray.push(favMovie!)
    }
    if(favoriteArray.length===0)
        return res.status(200).json("Favorite list is empty")
     return res.status(200).json(favoriteArray)
    }
    catch{
    return res.status(500).json({ error: "Error adding movie to favorites" });
    }
}

export const getShowtimeModifiable = async (showtimeId: any) => {
    try{
        const bookings = await Bookings.find({showtime: showtimeId, bookingStatus: "Confirmed"})
        if(bookings === undefined) return false;
        return (bookings.length > 0)
    }
    catch{
        console.log(`Server error while getting showtime modifiability for showtime ${showtimeId}`)
    }
}


export const confirmBookingPayment = async (req: Request, res: Response) => {
    const bookingId = req.query.bookingId
    const booking = await Bookings.findById(bookingId)

    if(!booking) return res.status(404).send({message: `Booking not found`});

    booking.bookingStatus = "Confirmed"
    await booking.save()

    res.status(200).send({message: `Booking payment has been confirmed`})
}
