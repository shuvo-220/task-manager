import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


export default async function authMiddleware(req, res, next){
    const authHeader = req.headers.authorization?.split(" ")[1];
    if(!authHeader){
        return res.status(400).json({success:false, message:'no authorised token'})
    }
    const token = authHeader;
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(payload.id).select('-password');
        if(!user){
            return res.status(500).json('user not found');
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({success:false, message:'token invalid or expired'});
    }
}
