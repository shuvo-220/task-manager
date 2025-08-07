import User from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import isEmail from 'validator/lib/isEmail.js';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPEIRES = '24h'

const createToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPEIRES });

export async function registerUser(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'all fields required' });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'invalid email' });
    }
    if (validator.password.length < 8) {
        return res.status(400).json({ success: false, message: 'password must be 8 char or more' });
    }
    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ success: false, message: 'user already exist, please login' })
        }
        const hased = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hased })
        const token = createToken(user._id)
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: 'server error' });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'all fields required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        const match = bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, message: 'invalid login details' });
        }
        const token = createToken(user._id)
        res.json({
            success: true, token, user: {
                name: user.name, email: user.email
            }
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: 'server error' });
    }
}

export async function getCurrentUser(req, res){
    try {
        const user = await User.findById(req.user.id).select('name email');
        if(!user){
            return res.status(400).json({success:false, message:'user not found'});
        }
        res.json({success:true, user})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success:false, message:'server error'});
    }
}

export async function updateProfile(req, res){
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.json({success:true, user})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success:false, message:'server error'});
    }
}

export async function updatePassword(req, res){
    const{currentPassword, newPassword} = req.body;
    if(!currentPassword || !newPassword || newPassword.length <8){
        return res.status(400).json({success:false, message:'password invalid or too short'});
    }
    try {
        const user = await User.findById(req.user.id).select('password');
        if(!user){
            return res.status(400).json({success:false, message:'user not found'});
        }
        const match = bcrypt.compare(currentPassword, user.password)
        if(!match){
            return res.status(400).json({success:false, message:'currrent password not matched'});
        }
        user.password = bcrypt.hash(newPassword, 10)
        await user.save();
        res.json({success:true, message:'password changed'});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({success:false, message:'server error'});
    }
}