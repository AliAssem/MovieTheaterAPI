/*
Showtime:
    Movie [movie id]
    Hall Number [int]
    Date [string?Date?] 1/2/2025
    Start Time (minute) [int]
    End Time (minute) [int]
    Ticket Price [int]
    Total Capacity [int]
*/

const seatsArr: boolean[][] = Array.from({ length: 26 }, () => 
  Array(10).fill(false)
);
import mongoose from "mongoose";
export const showtimeSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    hallNumber: { type: Number, required: true },
    seats: [[Boolean]], default: seatsArr,
    date: { type: Date, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    ticketPrice: { type: Number, required: true },
    totalCapacity: { type: Number, required: true }
});

export const Showtime = mongoose.model("Showtime", showtimeSchema);