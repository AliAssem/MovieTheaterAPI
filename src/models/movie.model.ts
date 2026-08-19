/*
Movie:
    Title [string]
    Genre [string]
    Duration (minutes) [number]
    Description [string]
    Poster URL [string]
    !   Rating [float? m3rfsh esmo eh fi typescript]        rating = ratingSum / ratingCount
    Status [Now Showing / Coming Soon]

    Rating Sum [number]
    Rating Count [number]
    
*/
import mongoose from "mongoose";
export interface Movie {
    title: string;
    genre: string;
    duration: number;
    description: string;
    posterUrl: string;
    rating: number;
    ratingSum: number;
    ratingCount: number;
    releaseDate: Date;
    status: "Now Showing" | "Coming Soon";
}
export const movieSchema = new mongoose.Schema<Movie>({
    title:       { type: String, required: true },
    genre:       { type: String, required: true },
    duration:    { type: Number, required: true },
    description: { type: String, required: true },
    posterUrl:   { type: String, required: true },
    rating:      { type: Number, default: 0 },
    ratingSum:   { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    releaseDate: { type: Date,   required: false },
    status:      { type:String, enum: ["Now Showing", "Coming Soon"], required: true }
});
export const Movies  = mongoose.model("Movie", movieSchema);





// export const Movies  = mongoose.model("Movie", movieSchema);