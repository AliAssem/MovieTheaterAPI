import { Request, Response } from "express";
import { Movie, Movies } from "../models/movie.model";
import { Showtimes } from "../models/showtime.model";




// Controller functions to add:

// Customer:
//      getAllMovies
//      searchMovies
// Cinema Admin
//      addMovie
//      editMovie
//      deleteMovie

export const getAllMovies = async (req: Request, res: Response) => {
    const movies = await Movies.find()
    res.status(200).send(movies)
}

export const searchMovies = async (req: Request, res: Response) => { // add filter by showtime LATER
    try{
        let searchQuery:any = { }

        const {title, genre, durationMin, durationMax, ratingMin,
             ratingMax, sortType, sortDirection, status} = req.query

        if(title) searchQuery.title = title
        if(genre) searchQuery.genre = genre
        if(status && (status == "Now Showing" || status == "Coming Soon")) searchQuery.status = status

        if(durationMin || durationMax){
            searchQuery.duration = { }
            if(durationMin){ searchQuery.duration.$gte = Number(durationMin) }
            if(durationMax){ searchQuery.duration.$lte = Number(durationMax) }
        }

        if(ratingMin || ratingMax){
            searchQuery.duration = { }
            if(ratingMin){ searchQuery.rating.$gte = Number(ratingMin) }
            if(ratingMax){ searchQuery.rating.$lte = Number(ratingMax) }
        }


        const searchedMovies = await Movies.find(searchQuery)

        let sortD = 1
        if(sortDirection === "dec") { sortD = -1 }

        if(sortType){
                 if(sortType == "rating"){ searchedMovies.sort((movA, movB) => {return (movA.rating - movB.rating) * sortD}) }
            else if(sortType == "releaseDate"){ searchedMovies.sort((movA, movB) => {return (movA.releaseDate.getTime() - movB.releaseDate.getTime()) * sortD}) }
        }

        res.status(200).send(searchedMovies)
    }
    catch{
        return res.status(500).send({message: `Server error while searching for movies`})
    }
}



export const addMovie = async (req: Request, res: Response) => {
    const {title, genre, duration, description, posterUrl, releaseDate} = req.body

    

    try{
        const newMovie = await Movies.create({
            title: title,
            genre: genre,
            duration: duration,
            description: description,
            posterUrl: posterUrl,
            releaseDate: new Date(releaseDate),
            status: "Coming Soon"
        })
        // await Movies.create(newMovie)
        res.status(201).send({message: `Movie created successfully`, newMovie})
    }
    catch{
        res.status(500).send({message: `Server error while creating new movie`})
    }
}

export const editMovie = async (req: Request, res: Response) => {
    const movieId = req.query.movieId

    try{
        let stat = await Movies.findOneAndUpdate({_id: movieId}, req.body, {returnDocument: 'after'})
        if(!stat){
            return res.status(404).send({message: `Movie id not found`})
        }
        res.status(200).send({message: `Movie updated successfully`})
    }
    catch{
        res.status(500).send({message: `Server error while editing movie`})
    }


}


export const deleteMovie = async (req: Request, res: Response) => {
    const movieId = req.query.movieId

    try{
        let stat = await Movies.deleteOne({_id: movieId})
        if(!stat.deletedCount){
            return res.status(404).send({message: `Movie id not found`})
        }
        res.status(200).send({message:`Movie deleted successfully`})
    }
    catch{
        res.status(500).send({message: `Server error while deleting a movie`})
    }
}



export const updateMovieStatus = async (movieId: any) => {
    try{
        const movie = await Movies.findById(movieId)
        if(!movie || movie.status == "Now Showing") return;

        
        movie.status = "Now Showing"
        await movie.save()
    }
    catch{
        console.log(`Error occured while updating movie status for movie ${movieId}`)
        return
    }
}