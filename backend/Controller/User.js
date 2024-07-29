import { User } from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";

//new user registration
export const registerUser = async(req ,res) =>{
    try {
        const { name, email ,password ,contact } = req.body;
        let user = await User.findOne({email});
        if(user)
        {
            res.status(400).json({
                message : "User Already Exists",
            });
        }

        //Hash Password
        const hashPassword = await bcrypt.hash(password ,10);

        //Generate otp
        const otp = Math.floor(Math.random()*1000000);

        //create new user
        user = { name ,email ,hashPassword ,contact };

        //Signed Activation token
        const activationToken =jwt.sign({user , otp} , process.env.ACTIVATION_SECRET ,{
            expiresIn: "5m",
        })


        //sendMail
        const message = `Please verify your account using your OTP Your OTP is ${otp}`;
        await sendMail(email , "Welcome to Ecommerce" ,message);

        return res.status(200).json({
            message : "OTP Sent to your mail",
            activationToken,
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message,
        });
    }
};

//verify OTP
export const verifyUser = async (req ,res )=>{
    try{
        const { otp, activationToken } = req.body;
        const verify = jwt.verify(activationToken ,process.env.ACTIVATION_SECRET);
        if(!verify){
            return res.json({
                message : "OTP Expired",
            })
        }

        if(verify.otp !== otp)
        {
            return res.json({
                message : "Wrong OTP",
            })
        }

        await User.create({
            name: verify.user.name,
            email: verify.user.email,
            password: verify.user.hashPassword,
            contact: verify.user.contact,
        })

        return res.status(200).json({
            message : "User Registration Success",
        });

    }catch(error)
    {
        return res.status(500).json({
            message : error.message,
        });
    }
};

//login user
export const loginUser = async (req ,res ) =>{
    try {
        const { email , password } =req.body;

        //check Email
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message : "Invalid Credentials",
            });
        }

        //check password
        const matchPassword = await bcrypt.compare(password ,user.password );
        if(!matchPassword){
            return res.status(400).json({
                message : "Invalid Credentials",
            });
        }

        //Signed token
        const token =  jwt.sign({ _id: user.id}, process.env.JWT_SECRET ,{ expiresIn: "15d"});

        //Exclude password
        const { password: UserPassword, ...userDetails }= user.toObject();

        return res.status(200).json({
            message : "Welcome " + user.name,
            token,
            user :userDetails,
        });

    } catch (error) {
        return res.status(500).json({
            message : error.message,
        });
    }
};

//user profile
export const userProfile = async(req , res) =>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        return res.status(200).json({
            user,
        });

    } catch (error) {
        return res.status(500).json({
            message : error.message,
        });
    }
};
