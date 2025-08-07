import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect(process.env.DB_URL).then(()=>{
        console.log('database connected');
    }).catch((error)=>{
        console.log(error.message);
    })
}