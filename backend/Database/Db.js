import mongoose from "mongoose";

const ConnectDb = async()=>{
    try {
        await mongoose.connect(process.env.DB);
        console.log("DataBase connected");
    } catch (error) {
        console.log(error);
    }
}

export default ConnectDb;