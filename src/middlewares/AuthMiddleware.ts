import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Users } from "../models/user.model";
import { Role } from "../models/user.model";
export interface AuthRequest extends Request {
  user?: any;
}

// const rolePermissions:any = {
//   "GetMovies": ["Customer", "Cinema Admin"],
//   "ManageMovies": ["Cinema Admin"],
//   "CreateBooking": ["Customer", "Cinema Admin"],
//   "GetMyBookings": ["Customer"],
//   "CancelBooking": ["Customer", "Cinema Admin"],
//   "GetAllBookings": ["Cinema Admin"]
// }

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, role: string };
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}


export const requireRole = (role: Role) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
}