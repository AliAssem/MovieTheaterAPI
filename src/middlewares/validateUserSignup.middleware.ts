import { Request, Response, NextFunction } from "express"


// fill provider list LATER
const validMailProviders:String[] = [
    "gmail.com",
    "yahoo.com",
]

const specialCharacters:any[] = [
    '!','@','#','$','%','^','&','*','(',')','_',
    '+','=','-','`','~','/','\\','?','{','}',']',
    ':',';',',','.','<','>','[',']'
]

/*
Valid Password:
    Length: (8 -> 20)

    Has atleast 1 special character [   ! @ # $ % ^ & * ( ) _ + = - ` ~ / \ ? { } : ; , . < > [ ]   ]
    Has atleast 1 uppercase letter
*/

export const validateUserSignup = (req: Request, res: Response, next: NextFunction) => {

    // const fullName:any = "Ahmed Mohamed"
    // const email:any = "ahmedmohamed@gmail.com"
    // let password:any = "password"
    // const role = "Role"       // users cant signup as admin? LATER
    const { fullName, email, password } = req.body

    // Link variables above to request body LATER

    // Full Name
    if(!fullName || typeof fullName !== "string" || fullName == ""){
        return res.status(400).send({message : `'fullName' must be a non-empty string`})
    }
    // Email [string && non-empty]
    if(!email || typeof email !== "string" || email == ""){
        return res.status(400).send({message : `'email' must be a non-empty string`})
    }

    // Email [has 1 '@']]           check if length == 2 is valid check LATER
    const emailFormatted:String[] = email.split("@")
    if(emailFormatted.length != 2){
        return res.status(400).send({message: `provided email is not a valid email "example@provider.com"`})
    }
    // Email [valid mail provider]
    if(!validMailProviders.includes(emailFormatted[1])){
        return res.status(400).send({message: `Email provider is not a recognized provider`})
    }
    if(emailFormatted[0] == ""){
        return res.status(400).send({message: `provided email is not a valid email "example@provider.com"`})
    }
    // Add validation for ' ' and any non valid character of an email LATER


    // Password
    //  password [string && non-empty]
    if(typeof password !== "string" || password == ""){
        return res.status(400).send({message: `'password' must be a non-empty string`})
    }
    //  password [8 <= length <= 20]
    if(password.length < 8 || password.length > 20){
        return res.status(400).send({message: `password length must be between 8 and 20`})
    }

    //  password [special character]
    let passHasSpecialChar:Boolean = false;
    for (let idx = 0; idx < password.length; idx++) {
        const element = password[idx];
        if(specialCharacters.includes(element)){
            passHasSpecialChar = true;
            break;
        }        
    }
    if(!passHasSpecialChar){
        return res.status(400).send({message: `password must include at least 1 special character`})
    }
    //  password [has uppercase letter]
    if(password.toLowerCase() == password){
        return res.status(400).send({message: `password must include at least 1 uppercase letter`})
    }



    next();


}