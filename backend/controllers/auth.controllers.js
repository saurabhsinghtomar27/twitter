import User from "../models/user.models.js"
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
export const signup = async(req, res) => {
 try{
    const {username,fullname,email,password} = req.body;
    // res.json({username,fullname,email,password});
    const existinguser=await User.findOne({username});
    if(existinguser){
      return res.status(400).json({message:"Username already exists"});
    }
    const exsitingemail=await User.findOne({email});
    if(exsitingemail){
      return res.status(400).json({message:"Email already exists"});
    }
    const salt=await bcrypt.genSalt(10);
    const hashedpassword=await bcrypt.hash(password,salt);
    const newUser=new User({
      username,
      fullname,
      email,
      password:hashedpassword
    });
    if(newUser){
      generateTokenAndSetCookie(newUser._id,res);
      await newUser.save();
      res.status(201).json({
        _id:newUser._id,
        username:newUser.username,
        fullname:newUser.fullname,
        email:newUser.email,
        followers:newUser.followers,
        following:newUser.following,
        profileImg:newUser.profileImg,
        coverImg:newUser.coverImg
      });
    }
    else{
      res.status(400).json({message:"Invalid user data"});
      
      }
 }
 catch(error){
  res.status(500).json({message:"Something went wrong " ,error});
 }
}
export const login = async(req, res) => {
  try{
    const {username,password}=req.body;
    const user=await User.findOne({username});
    if(!user){
      return res.status(400).json({message:"Invalid username"});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({message:"Invalid password"});
    }
    generateTokenAndSetCookie(user._id,res);
    res.status(200).json({
      _id:user._id,
      username:user.username,
      fullname:user.fullname,
      email:user.email,
      followers:user.followers,
      following:user.following,
      profileImg:user.profileImg,
      coverImg:user.coverImg
    });
  }
    catch(error){
      res.status(500).json({message:"Internal Servwer Error"});
    }
}
export const logout = (req, res) => {
  try{
    res.clearCookie("jwt");
    res.status(200).json({message:"Logged out successfully"});
  }
  catch(error){
    res.status(500).json({message:"Internal Server Error"});
  }
}

export const getMe = async(req, res) => {  
  try{
    const user=await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
 
    }
    catch(error){
      res.status(500).json({message:"Internal Server Error"});
    }
}
