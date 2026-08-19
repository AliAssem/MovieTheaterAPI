import { Request, Response } from "express";
import { Movie, Movies } from "../models/movie.model";




// Controller functions to add:

// Customer:
//      getAllMovies
// Cinema Admin
//      addMovie
//      editMovie
//      deleteMovie

export const getAllMovies = async (req: Request, res: Response) => {
    const movies = Movies.find()
    res.status(200).send(movies)
}



export const addMovie = async (req: Request, res: Response) => {
    const {title, genre, duration, description, posterUrl} = req.body

    const newMovie: Movie = {
        title: title,
        genre: genre,
        duration: duration,
        description: description,
        posterUrl: posterUrl,
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
        let stat = await Movies.findOneAndUpdate({_id: movieId}, req.body, {new: true})
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