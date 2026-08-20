import express, { Application } from "express";

const app: Application = express();


import "dotenv/config"
import { connectDB }    from "./config/db";
import { setupSwagger } from "./config/swagger";

import movieRouter    from "./routes/movie.router"
import userRouter     from "./routes/user.router"
import showtimeRouter from "./routes/showtime.router"
import bookingRouter  from "./routes/booking.router"

const PORT = process.env.PORT

app.use(express.json());

setupSwagger(app);


app.use("/movies",      movieRouter)
app.use("/users",       userRouter)
app.use("/showtimes",   showtimeRouter)
app.use("/bookings",    bookingRouter)



connectDB().then(()=> {
    app.listen(PORT, ()=> {
        console.log(`Server running on port ${PORT}`)
    })
})