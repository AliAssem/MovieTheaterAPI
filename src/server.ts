import express, { Application } from "express";

const app: Application = express();


import "dotenv/config"
import { connectDB } from "./config/db";
import { setupSwagger } from "./config/swagger";
const PORT = process.env.PORT

app.use(express.json());

setupSwagger(app);





connectDB().then(()=> {
    app.listen(PORT, ()=> {
        console.log(`Server running on port ${PORT}`)
    })
})