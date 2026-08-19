import { Request, Response } from "express";
import { Movie, Movies } from "../models/movie.model";




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

export const searchMovies = async (req: Request, res: Response) => {
    try{
        let searchQuery:any = { }

        const {title, genre, durationMin, durationMax, ratingMin, ratingMax} = req.query

        if(title) searchQuery.title = title
        if(genre) searchQuery.genre = genre

        if(durationMin || durationMax){
            searchQuery.duration = { }
            if(durationMin){ searchQuery.duration.$gte = Number(durationMin) }
            if(durationMax){ searchQuery.duration.$lte = Number(durationMax) }
        }

        if(ratingMin || ratingMax){
            searchQuery.duration = { }
            if(ratingMin){ searchQuery.duration.$gte = Number(ratingMin) }
            if(ratingMax){ searchQuery.duration.$lte = Number(ratingMax) }
        }


        const searchedMovies = await Movies.find(searchQuery)

        res.status(200).send(searchedMovies)
    }
    catch{
        return res.status(500).send({message: `Server error while searching for movies`})
    }
}



export const addMovie = async (req: Request, res: Response) => {
    const {title, genre, duration, description, posterUrl} = req.body

    const newMovie: Movie = {
        title: title,
        genre: genre,
        duration: duration,
        description: description,
        posterUrl: posterUrl,
        rating: 0,
        ratingSum: 0,
        ratingCount: 0,
        status: "Coming Soon"
    }

    try{    
        await Movies.create(newMovie)
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