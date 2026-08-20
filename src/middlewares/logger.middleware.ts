import { Request, Response, NextFunction } from "express"

export const logger = (req: Request, res: Response, next: NextFunction) => {
    const str = "[" + new Date(Date.now()).toLocaleString()  + "] " + "(" + req.ip + ") " + req.method + " " +  req.originalUrl
    console.log(str)
    next()
}