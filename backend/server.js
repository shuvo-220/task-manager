import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({})
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';

const app = express()
const port = process.env.PORT || 4000

//middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//database
connectDB()

app.use('/api/user', userRouter);


app.listen(port, ()=>{
    console.log(`server running on port : ${port}`)
})