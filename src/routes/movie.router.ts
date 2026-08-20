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
import { logger } from "../middlewares/logger.middleware";

const router = Router();

router.get("/", logger, authenticate, getAllMovies);
router.get("/search", logger, authenticate, searchMovies)

router.post("/add", logger, authenticate, requireRole("Cinema Admin"), validateNewMovie, addMovie);
// router.put("/edit", /*authenticate, authorize("Cinema Admin"),*/ editMovie);               add /movies/replace LATER
router.patch("/edit", logger, authenticate, requireRole("Cinema Admin"), editMovie);
router.delete("/delete", logger, authenticate, requireRole("Cinema Admin"), deleteMovie);

export default router;