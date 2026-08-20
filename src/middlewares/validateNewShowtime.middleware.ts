import { Request, Response, NextFunction } from "express"


export const validateNewShowtime = async (req: Request, res: Response, next: NextFunction) => {
    const {movieId, hallNumber, date, startTime, endTime, ticketPrice, rows, columns} = req.body

    if(!movieId) return res.status(400).send({message: `'movieId' must be included`});

    if(!hallNumber || typeof hallNumber !== "number" || hallNumber <= 0) return res.status(400).send({message: `'hallNumber' must be a positive number`});

    if(!date || !(new Date(date).valueOf())) return res.status(400).send({message: `'date' must be a valid Date eg. 2026/12/18`});
    if(new Date(date).getMilliseconds() > Date.now()) return res.status(400).send({message: `'date' must be a future date`});

    if(!startTime || !endTime || !(new Date(startTime).valueOf()) || !(new Date(endTime).valueOf())) return res.status(400).send({message: `'startTime' & 'endTime' must be included as valid Dates`});
    if(new Date(startTime).getMilliseconds() >= new Date(endTime).getMilliseconds()) return res.status(400).send({message: `'startTime' cannot be after 'endTime'`});

    if(!ticketPrice || typeof ticketPrice !== "number" || ticketPrice < 0) return res.status(400).send({message: `'ticketPrice' must be a positive number`});

    if(!rows || rows > 26 || rows < 1) return res.status(400).send({message: `'rows' must be a positive number between 1 and 26 (inclusive))`});
    if(!columns || columns > 10 || columns < 1) return res.status(400).send({message: `'columns' must be a positive number between 1 and 10 (inclusive))`});



    next()

}