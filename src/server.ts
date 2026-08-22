import { connectDB }    from "./config/db";
import express, { Application } from "express";

const app: Application = express();


import "dotenv/config"
import { setupSwagger } from "./config/swagger";

import movieRouter     from "./routes/movie.router"
import userRouter      from "./routes/user.router"
import showtimeRouter  from "./routes/showtime.router"
import bookingRouter   from "./routes/booking.router"
import dashboardRouter from "./routes/dashboard.router"
import { logger } from "./middlewares/logger.middleware";

const PORT = process.env.PORT

app.use(express.json());

setupSwagger(app);


app.use("/movies",      movieRouter)
app.use("/users",       userRouter)
app.use("/showtimes",   showtimeRouter)
app.use("/bookings",    bookingRouter)
app.use("/dashboard",   dashboardRouter)



/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Other]
 *     summary: Returns server health status
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Server error
 */
app.get("/health", logger, (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Cannot find route: ${req.originalUrl} on this server!`
  });
});


connectDB().then(()=> {
    app.listen(PORT, ()=> {
        console.log(`Server running on port ${PORT}`)
    })
})