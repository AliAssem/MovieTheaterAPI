import { Request, Response } from "express"
import { Showtimes } from "../models/showtime.model"
import { updateMovieStatus } from "./movie.controller";
import { getShowtimeModifiable } from "./Customers.controller";


export const createShowtime = async (req: Request, res: Response) => {
    
    try{
        const {movieId, hallNumber, date, startTime, endTime, ticketPrice, rows, columns, unavailableSeats} = req.body

        // let seats: boolean[][] = maxSeatsArr
        let seats: boolean[][] = Array.from({ length: 26 }, () => 
          Array(10).fill(false)
        );
        let seatsVisiblity: boolean[][] = Array.from({ length: 26 }, () => 
          Array(10).fill(true)
        );

        for(let i=rows; i<26; i++){
            for(let j=0; j<10; j++){
                // seats[i][j] = true;
                seatsVisiblity[i][j] = false;
            }
        }

        for(let i=columns; i<10; i++){
            for(let j=0; j<26; j++){
                // seats[j][i] = true;
                seatsVisiblity[j][i] = false;
            }
        }

        for(let i=0; i<unavailableSeats.length; i++){
            const seat = unavailableSeats[i]
            seatsVisiblity[seat.charCodeAt(0) - 65][Number(seat[1]) - 1] = false
        }

        


        const newShowtime = await Showtimes.create({
            movieId,
            hallNumber,
            seats,
            seatsVisiblity,
            date,
            startTime,
            endTime,
            ticketPrice,
            rows,
            columns
        })


        await updateMovieStatus(movieId)

        res.status(201).send({message: `Showtime created successfully with id ${newShowtime._id}`})
    }
    catch{
        return res.status(500).send({message: `Server error while creating new showtime`})
    }


}


export const deleteShowtime = async (req: Request, res: Response) => {
    try{
        const showtimeId = req.query.showtimeId

        if(!showtimeId) return res.status(400).send({message: `'showtimeId' must be included`});
        

        const showtime = await Showtimes.findOne({_id: showtimeId})
        if(!showtime) return res.status(404).send({message: `Showtime not found`});

        // for(let i=0; i<showtime.rows; i++){
        //     for(let j=0; j<showtime.columns; j++){
        //         if(showtime.seats[i][j]) return res.status(400).send({message: `Cannot delete a showtime with confirmed bookings`});
        //     }
        // }

        const canModify = await getShowtimeModifiable(showtimeId)
        if(!canModify) return res.status(400).send({message: `Cannot delete a showtime with confirmed bookings`});


        // const showtime = await Showtimes.deleteOne({_id: showtimeId})
        const result = await Showtimes.deleteOne({_id: showtimeId})
        if(!result.deletedCount) return res.status(404).send({message: `Something went wrong`});

        res.status(200).send({message: `Showtime deleted successfully`})

    }
    catch{
        return res.status(500).send({message: `Server error while deleting showtime`})
    }
}



export const replaceShowtime = async (req: Request, res: Response) => {
    
    try{
        const showtimeId = req.query.showtimeId
        const {movieId, hallNumber, date, startTime, endTime, ticketPrice, rows, columns, unavailableSeats} = req.body


        

        // let seats: boolean[][] = maxSeatsArr
        let seats: boolean[][] = Array.from({ length: 26 }, () => 
          Array(10).fill(false)
        );
        let seatsVisiblity: boolean[][] = Array.from({ length: 26 }, () => 
          Array(10).fill(true)
        );

        for(let i=rows; i<26; i++){
            for(let j=0; j<10; j++){
                // seats[i][j] = true;
                seatsVisiblity[i][j] = false;
            }
        }

        for(let i=columns; i<10; i++){
            for(let j=0; j<26; j++){
                // seats[j][i] = true;
                seatsVisiblity[j][i] = false;
            }
        }

        for(let i=0; i<unavailableSeats.length; i++){
            const seat = unavailableSeats[i]
            seatsVisiblity[seat.charCodeAt(0) - 65][Number(seat[1]) - 1] = false
        }


        const showtime = await Showtimes.findById(showtimeId)

        if(!showtime) return res.status(404).send({message: `Showtime not found`});


        const canModify = await getShowtimeModifiable(showtimeId)
        if(!canModify) return res.status(400).send({message: `Cannot edit a showtime with confirmed bookings`});

        // for(let i=0; i<showtime.rows; i++){
            // for(let j=0; j<showtime.columns; j++){
                // if(showtime.seats[i][j]) return res.status(400).send({message: `Cannot edit a showtime with confirmed bookings`});
            // }
        // }

        showtime.movieId = movieId
        showtime.hallNumber = hallNumber
        // showtime.seats = seats
        showtime.set('seats', seats)
        showtime.set('seatsVisiblity', seatsVisiblity)
        showtime.date = date
        showtime.startTime = startTime
        showtime.endTime = endTime
        showtime.ticketPrice = ticketPrice
        showtime.rows = rows
        showtime.columns = columns

        // showtime = {
        //     movieId,
        //     hallNumber,
        //     seats,
        //     date,
        //     startTime,
        //     endTime,
        //     ticketPrice,
        //     rows,
        //     columns
        // }

        await showtime.save()

        res.status(200).send({message: `Showtime replaced successfully`})
    }
    catch{
        return res.status(500).send({message: `Server error while replacing showtime`})
    }
}


export const browseShowtimes = async (req: Request, res: Response) => {
    try{
        const { movieId, date, hallNumber } = req.query;
        let filterQuery: any = {};

        if (movieId) filterQuery.movie = movieId;
        
        if (date) filterQuery.date = date;

        if (hallNumber) filterQuery.hallNumber = hallNumber;

        const showtimes = await Showtimes.find(filterQuery).populate("movie", "title posterUrl duration rating");

        res.status(200).send(showtimes);
    }
    catch {
        res.status(500).send({ message: `Server error while fetching showtimes` });
    }
}