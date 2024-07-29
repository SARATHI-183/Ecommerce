import express from 'express';
import dotenv from 'dotenv';
import ConnectDb from './Database/Db.js';

const app=express();
dotenv.config();
const port = process.env.PORT;

//middlewares
app.use(express.json());

//import routes
import userRoutes from './routes/User.js'
import productRoutes from './routes/Product.js'

//static files
app.use("/uploads",express.static("uploads"));

app.use('/api/',userRoutes);
app.use('/api',productRoutes);

app.get('/',(req,res)=>{
    res.send("<h1>Welcome to mern</h1>");
})

app.listen(port,()=>{
    console.log(`server started on port ${process.env.PORT}`);
    ConnectDb();
});