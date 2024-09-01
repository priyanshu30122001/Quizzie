const express = require('express');
const User = require("../schemas/user")
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

//login route
router.post('/login',async(req,res,next)=>{
    try{
        const{email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
           return res.status(400).json({message:'access denied'});
        }
        const validPassword = await bcrypt.compare(password,user.password)
        if(!validPassword){
           return res.status(400).json({message:'access denied'});
        }
        else{
            const token = jwt.sign({_id:user._id},process.env.JWT_SECRET)
            res.json({message:"logged in ",user:user.name,token:token,userId:user._id}) 
        }
    }catch(err){
        next(err);
    }
})


//signup route
router.post('/register',async(req,res,next)=>{
    const{name,email,password}=req.body;
    const user = await User.findOne({email}); 
    if(user){
        return res.status(400).json({message:"user already exist"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)
    const newUser = new User({
        name,
        email,
        password:hashedPassword,
    });
    await newUser.save();
    res.status(200).json({message:"User registered successfully "}) ;
})


module.exports= router;