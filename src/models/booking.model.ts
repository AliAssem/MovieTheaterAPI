/*
Booking:
    Customer [reference? User]
    Showtime [reference? Showtime]
    Selected Seats [array<number>]
    TotalPrice [int]
    Booking Status [Pending / Confirmed / Cancelled] // Done
*/
import mongoose from "mongoose";
import {Showtime} from "./showtime.model";
export type BookingStatus = "Pending" | "Confirmed" | "Cancelled";
export interface Booking {
    customer: mongoose.Types.ObjectId;
    showtime: mongoose.Types.ObjectId;
    selectedSeats: string[];
    totalPrice: number;
    bookingStatus: BookingStatus;
}
export const bookingSchema = new mongoose.Schema<Booking>({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: "Showtime", required: true },
    selectedSeats: { type: [String], required: true },
    totalPrice: { type: Number, required: true },
    bookingStatus: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], required: true }
});
export const Booking = mongoose.model("Booking", bookingSchema);