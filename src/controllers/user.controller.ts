import { Request, Response } from "express"
import { Users } from "../models/user.model";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

export const userSignup = async (req: Request, res: Response) => {
    try{
        const {fullName, email, password} = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const existing = await Users.findOne({email: email})
        if(existing){
            return res.status(401).send({message: `Email is already linked to an account`})
        }


        const newUser = await Users.create({
            fullName,
            email,
            role: "Customer",
            password: hashedPassword
        })


        const token = jwt.sign(
            { id: newUser._id, role: "Customer" },
            process.env.JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).send({message: `New user created successfully`, token})

    }
    catch{
        return res.status(500).send({message: `Server error while creating new user`})
    }
}


export const userLogin = async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body

        const user = await Users.findOne({email: email})

        if(!user){
            return res.status(401).send({message: `Email not linked to a valid account`})
        }


        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(401).send({message: `Incorrect password`})
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).send({message: `Successfull login`, token})
    }
    catch{
        return res.status(500).send({message: `Server error while logging in`})
    }
}