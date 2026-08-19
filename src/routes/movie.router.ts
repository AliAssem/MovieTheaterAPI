/*

Customer:
     GET get all movies           `/movies`
     GET search movies            `/movies/search`
Cinema Admin
     POST add movie               `/movies/add`
     PATCH edit movie             `/movies/edit?MOVIE_ID`
     DELETE remove a movie        `/movies/delete?MOVIE_ID`

*/
import { Router } from "express";


import {
      addMovie, deleteMovie, editMovie, getAllMovies, searchMovies
} from "../controllers/movie.controller";
import { validateNewMovie } from "../middlewares/validateNewMovie.middleware";


// import {authenticate, authorize} from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/", getAllMovies);
router.get("/search", searchMovies)

router.post("/add", /*authenticate, authorize("Cinema Admin"),*/ validateNewMovie, addMovie);
// router.put("/edit", /*authenticate, authorize("Cinema Admin"),*/ editMovie);               add /movies/replace LATER
router.patch("/edit", /*authenticate, authorize("Cinema Admin"),*/ editMovie);
router.delete("/delete", /*authenticate, authorize("Cinema Admin"),*/ deleteMovie);

export default router;