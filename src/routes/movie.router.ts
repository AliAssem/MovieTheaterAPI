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


import { authenticate, requireRole } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/", authenticate, getAllMovies);
router.get("/search", authenticate, searchMovies)

router.post("/add", authenticate, requireRole("Cinema Admin"), validateNewMovie, addMovie);
// router.put("/edit", /*authenticate, authorize("Cinema Admin"),*/ editMovie);               add /movies/replace LATER
router.patch("/edit", authenticate, requireRole("Cinema Admin"), editMovie);
router.delete("/delete", authenticate, requireRole("Cinema Admin"), deleteMovie);

export default router;