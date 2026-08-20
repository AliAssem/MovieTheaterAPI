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

import mongoose from "mongoose";


export const maxSeatsArr: boolean[][] = Array.from({ length: 26 }, () => 
  Array(10).fill(false)
);


export interface Showtime {
    movieId: mongoose.Schema.Types.ObjectId;
    hallNumber: Number;
    seats: boolean[][];
    date: Date;
    startTime: Date;
    endTime: Date;
    ticketPrice: Number;
    rows: Number;
    columns: Number;
}

export const showtimeSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    hallNumber: { type: Number, required: true },
    seats: { type: [[Boolean]], default: maxSeatsArr },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    ticketPrice: { type: Number, required: true },
    // totalCapacity: { type: Number, required: true }
    rows: {type: Number, required: true},
    columns: {type: Number, required: true}
});

export const Showtimes = mongoose.model("Showtime", showtimeSchema);