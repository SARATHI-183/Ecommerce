import jwt from 'jsonwebtoken';
import { User } from '../Models/User.js';

export const isAuth = async (req , res , next)=>{
    try {
        const token = req.headers.token;
        if(!token)
        {
            return res.status(403).json({
                message : "Please Login to access",
            });
        }

        //Decode jwt signed
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decodedData._id);
        next();

    } catch (error) {
        return res.status(403).json({
            message : "Please Login to access",
        });
    }
}