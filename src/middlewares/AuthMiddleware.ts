import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Users } from "../models/user.model";
export interface AuthRequest extends Request {
  user?: any; 
}
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
 const authHeader = req.headers.authorization;

 if (!authHeader) {
 return res.status(401).json({ message: "No token provided" });
 }

 const token = authHeader.split(" ")[1];

 try {
 const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, role: string };
 req.user = decoded; 
 next(); 
 } catch (err) {
 return res.status(401).json({ message: "Invalid or expired token" });
 }
}