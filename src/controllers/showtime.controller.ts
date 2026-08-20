import { Request, Response } from "express"
import { Showtimes, showtimeSchema, Showtime } from "../models/showtime.model"


export const createShowtime = async (req: Request, res: Response) => {
    
    try{
        const {movieId, hallNumber, date, startTime, endTime, ticketPrice, rows, columns} = req.body

        // let seats: boolean[][] = maxSeatsArr
        let seats: boolean[][] = Array.from({ length: 26 }, () => 
          Array(10).fill(false)
        );

        for(let i=rows; i<26; i++){
            for(let j=columns; j<10; j++){
                seats[i][j] = true;
            }
        }


        await Showtimes.create({
            movieId,
            hallNumber,
            seats,
            date,
            startTime,
            endTime,
            ticketPrice,
            rows,
            columns
        })


        res.status(201).send({message: `Showtime created successfully`})
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

        for(let i=0; i<showtime.rows; i++){
            for(let j=0; j<showtime.columns; j++){
                if(showtime.seats[i][j]) return res.status(400).send({message: `Cannot delete a showtime with confirmed bookings`});
            }
        }

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
        const {movieId, hallNumber, date, startTime, endTime, ticketPrice, rows, columns} = req.body

        // let seats: boolean[][] = maxSeatsArr
        let seats: boolean[][] = Array.from({ length: 26 }, () => 
            Array(10).fill(false)
        );


        for(let i=rows; i<26; i++){
            for(let j=columns; j<10; j++){
                seats[i][j] = true;
            }
        }


        const showtime = await Showtimes.findById(showtimeId)

        if(!showtime) return res.status(404).send({message: `Showtime not found`});

        showtime.movieId = movieId
        showtime.hallNumber = hallNumber
        // showtime.seats = seats
        showtime.set('seats', seats)
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