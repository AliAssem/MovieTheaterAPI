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
      addMovie,
      deleteMovie,
      editMovie,
      getAllMovies,
      replaceMovie,
      searchMovies
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
router.post("/add",                  logger, authenticate, requireRole("Cinema Admin"), validateNewMovie, addMovie);
/**
 * @swagger
 * /movies/replace:
 *   put:
 *     tags: [Movies]
 *     summary: Fully replace a movie by ID [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to replace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: string
 *               duration:
 *                 type: number
 *               description:
 *                 type: string
 *               posterUrl:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Movie replaced successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */

router.put("/replace",               logger, authenticate, requireRole("Cinema Admin"), validateNewMovie, replaceMovie);
/**
 * @swagger
 * /movies/edit:
 *   patch:
 *     tags: [Movies]
 *     summary: Partially edit movie fields by ID [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: string
 *               duration:
 *                 type: number
 *               description:
 *                 type: string
 *               posterUrl:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */

router.patch("/edit",                logger, authenticate, requireRole("Cinema Admin"), editMovie);
/**
 * @swagger
 * /movies/delete:
 *   delete:
 *     tags: [Movies]
 *     summary: Delete a movie by ID [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to delete
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         description: Movie ID not found
 *       500:
 *         description: Server error
 */

router.delete("/delete",             logger, authenticate, requireRole("Cinema Admin"), deleteMovie);

/**
 * @swagger
 * /movies/feedback:
 *   post:
 *     tags: [Customers]
 *     summary: Post rating and feedback for a movie [CUSTOMER]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - showtimeId
 *               - feedback
 *               - rate
 *             properties:
 *               showtimeId:
 *                 type: string
 *               feedback:
 *                 type: string
 *               rate:
 *                 type: number
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 *       400:
 *         description: Invalid input or missing fields
 *       500:
 *         description: Server error
 */

router.post("/feedback",             logger, authenticate, requireRole("Customer"), validatefeedback,postFeedback)
/**
 * @swagger
 * /movies/addFavorite/{movieId}:
 *   post:
 *     tags: [Customers]
 *     summary: Add a movie to customer favorite list [CUSTOMER]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to add to favorites
 *     responses:
 *       200:
 *         description: Movie added to favorites
 *       404:
 *         description: User or Movie not found
 *       500:
 *         description: Server error
 */

router.post("/addFavorite/:movieId", logger, authenticate, requireRole("Customer"), addfavorite);
/**
 * @swagger
 * /movies/favorite:
 *   get:
 *     tags: [Customers]
 *     summary: Get user favorite movies [CUSTOMER]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched favorite movies
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/favorite",              logger, authenticate, requireRole("Customer"), getfavorite);
export default router;