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
import {
  postFeedback,
  addfavorite,
  getfavorite
} from "../controllers/Customers.controller";
import { validatefeedback } from "../middlewares/validateNewBooking.middleware";
const router = Router();

/**
 * @swagger
 * /movies:
 *   get:
 *     tags: [Movies]
 *     summary: Returns all movies in DB
 *     responses:
 *       200:
 *         description: Returns json of all movies
 *       500:
 *         description: Server error
 */
router.get("/", logger, authenticate, getAllMovies);
/**
 * @swagger
 * /movies/search:
 *   get:
 *     tags: [Movies]
 *     summary: Search for a set of movies using filter queries
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: Movie title
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         required: false
 *         description: Movie genre
 *       - in: query
 *         name: durationMin
 *         schema:
 *           type: Number
 *         required: false
 *         description: Movie duration minimum
 *       - in: query
 *         name: durationMax
 *         schema:
 *           type: Number
 *         required: false
 *         description: Movie duration maximum
 *       - in: query
 *         name: ratingMin
 *         schema:
 *           type: Number
 *         required: false
 *         description: Movie rating minimum
 *       - in: query
 *         name: ratingMax
 *         schema:
 *           type: Number
 *         required: false
 *         description: Movie rating maximum
 *       - in: query
 *         name: sortType
 *         schema:
 *           type: string
 *           enum: [rating, releaseDate]
 *         required: false
 *         description: Sort according to overall rating or release date
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           enum: [asc, dec]
 *         required: false
 *         description: Ascending or Descending
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Now Showing, Coming Soon]
 *         required: false
 *         description: Movie status
 * 
 * 
 *     responses:
 *       200:
 *         description: OK returns list of filtered movies
 *       500:
 *         description: Server error
 */
router.get("/search", logger, authenticate, searchMovies)
/**
 * @swagger
 * /movies/add:
 *   post:
 *     tags: [Movies]
 *     summary: Add a new movie [ADMIN]
 * 
 * 
 * 
 * 
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - genre
 *               - duration
 *               - description
 *               - posterUrl
 *               - releaseDate
 *             properties:
 *               title:
 *                 type: string
 *                 description: Movie title
 *               genre:
 *                 type: string
 *                 description: Movie genre
 *               duration:
 *                 type: number
 *                 description: Movie duration
 *               description:
 *                 type: string
 *                 description: Movie description
 *               posterUrl:
 *                 type: string
 *                 description: Movie Poster URL link
 *               releaseDate:
 *                 type: Date
 *                 description: Movie release date
 * 
 * 
 *     responses:
 *       201:
 *         description: Movie created successfully (Returns new movie object)
 *       500:
 *         description: Server error
 */
router.post("/add", logger, authenticate, requireRole("Cinema Admin"), validateNewMovie, addMovie);
// router.put("/edit", /*authenticate, authorize("Cinema Admin"),*/ editMovie);               add /movies/replace LATER
router.patch("/edit", logger, authenticate, requireRole("Cinema Admin"), editMovie);
router.delete("/delete", logger, authenticate, requireRole("Cinema Admin"), deleteMovie);

router.post("/feedback",authenticate, requireRole("Customer"),validatefeedback,postFeedback)

router.post("/addFavorite/:movieId", authenticate, requireRole("Customer"), addfavorite);
router.get("/favorite", authenticate, requireRole("Customer"), getfavorite);
export default router;