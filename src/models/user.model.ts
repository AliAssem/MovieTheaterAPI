/*
User:
    Full Name [string]
    Email [string]
    Password [string?]
    Role [Customer / Cinema Admin]
*/

import mongoose from "mongoose";

export type Role = ("Customer" | "Cinema Admin")


const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Customer", "Cinema Admin"],
    required: true
  },
  favoriteMovies: {
    type: [ {movieId: {type: Number, required: true}} ],
    required: false
  },
  history : {
    type: [ {showtimeId: {type: Number, required: true}},{booked_seats: {type: [String], required: true}} ],
    required: false
  }
}, { collection: "users" });

export const Users = mongoose.model("User", userSchema);