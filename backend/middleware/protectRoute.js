import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
export const protectRoute = async (req, res, next) => {
  try{
    const token=req.cookies.jwt;
    if(!token){
      return res.status(401).json({message:"Unauthorize  no token provided"});
    }
    const decoded= jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded){
      return res.status(401).json({message:"Unauthorized token not valid"});
    }
    const user=await User.findById(decoded.id).select("-password");
    if(!user){
      return res.status(401).json({message:"User not found"});
    }
    req.user=user;
    next();
  }
  catch(error){
    return res.status(500).json({message:"Internal Server Error in protectRoute.js"});
  }
};