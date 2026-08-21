import { Request, Response } from "express"
import { Bookings } from "../models/booking.model";
import { Movies } from "../models/movie.model";
import { Showtimes } from "../models/showtime.model";


export const getDashboardStats = async (req: Request, res: Response) => {


    try{
        const confirmedBookings = await Bookings.find({ bookingStatus: "Confirmed" })
            
        let totalEarnings = 0;
        for (let i = 0; i < confirmedBookings.length; i++) {
            totalEarnings += confirmedBookings[i].totalPrice;
        }

        const activeMovies = await Movies.countDocuments({ status: "Now Showing" })

        const totalShowtimes = await Showtimes.countDocuments()

        res.status(200).send({
            message: "Dashboard statistics retrieved successfully",
            stats: {
                totalEarnings,
                activeMovies,
                totalShowtimes
            }
        });

    }
    catch{
        return res.status(500).send({error: `Server error while retrieving dashboard statistics`})
    }
}