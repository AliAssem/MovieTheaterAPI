/*

Customer:
     GET get all movies           `/movies`
Cinema Admin
     POST add movie               `/movies/add`
     PATCH edit movie             `/movies/edit?MOVIE_ID`
     DELETE remove a movie        `/movies/delete?MOVIE_ID`

*/
import { Router } from "express";


import {
      addMovie, deleteMovie, editMovie, getAllMovies 
} from "../controllers/movie.controller";


import {authenticate, authorize} from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/", getAllMovies);
router.get("/search", searchMovies)

router.post("/add", authenticate, authorize("Cinema Admin"), addMovie);
router.put("/edit", authenticate, authorize("Cinema Admin"), editMovie);
router.patch("/edit", authenticate, authorize("Cinema Admin"), editMovie);
router.delete("/delete", authenticate, authorize("Cinema Admin"), deleteMovie);

export default router;