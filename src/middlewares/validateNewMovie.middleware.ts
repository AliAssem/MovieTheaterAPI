import { Request, Response, NextFunction } from "express"


export const validateNewMovie = (req: Request, res: Response, next: NextFunction) => {
    const {title, genre, duration, description, posterUrl, releaseDate} = req.body

    if(!title || typeof title !== "string" || title == "") {
        return res.status(400).send({message: `Movie 'title' must be a non-empty string`})
    }

    if(!genre || typeof genre !== "string" || genre == "") {
        return res.status(400).send({message: `Movie 'genre' must be a non-empty string`})
    }

    if(!description || typeof description !== "string" || description == "") {
        return res.status(400).send({message: `Movie 'description' must be a non-empty string`})
    }

    if(!posterUrl || typeof posterUrl !== "string" || posterUrl == ""){
        return res.status(400).send({message: `Movie 'posterUrl' must be a non-empty string`})
    }

    if(!duration || typeof duration !== "number" || duration <= 0) {
        return res.status(400).send({message: `Movie 'duration' must be a positive number`})
    }

    if(!releaseDate || !(new Date(releaseDate).valueOf())){
        return res.status(400).send({message: `Movie 'releaseDate' must be a valid date eg. 2026/10/14`})
    }


    next()
}