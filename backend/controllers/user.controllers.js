import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";
export const getUserProfile = async (req, res) => { 
    const { username } = req.params;
    try {
        const user = await User.findOne({ username: username }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const followandUnfollow = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        if(id===req.user._id.toString()){
            return res.status(400).json({message:"You cannot follow yourself"});
        }
        if(!user || !currentUser){
            return res.status(404).json({message:"User not found"});
        }
        const isFollowing=currentUser.following.includes(id);
        if(isFollowing){
           await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
           await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
           res.status(200).json({message:"Unfollowed successfully"});
        }
        else{
            await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});
            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
            const notification=new Notification({
                from:req.user._id,
                to:id,
                type:"follow"
            });
            await notification.save();  
            res.status(200).json({message:"Followed successfully"});
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getSuggestedUsers = async (req, res) => {
    try {
        const userId=req.user._id;
        const userfollwedbyme=await User.findById(userId).select("following");
        const users=await User.aggregate([
            {
                $match:{
                    _id:{$ne:userId}
                }
            },
            {$sample:{size:10}}
        ])
        const filteredUsers=users.filter(user=>!userfollwedbyme.following.includes(user._id));
        const suggestedUsers=filteredUsers.slice(0,5);
        suggestedUsers.map(user=>user.password=undefined);
        res.status(200).json({suggestedUsers});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const updateUserProfile = async (req, res) => {
    const {username,email,currentPassword,newPassword,bio,link}=req.body;
    let {profileImg,coverImg}=req.body;
    const userId=req.user._id;
    try{
        let user=await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(!newPassword && currentPassword){
            return res.status(400).json({message:"Please enter new password"});
        }
        if(!currentPassword && newPassword){
            return res.status(400).json({message:"Please enter current password"});
        }
        if(currentPassword &&newPassword){
            const isMatch=await bcrypt.compare(currentPassword,user.password);
            if(!isMatch){
                return res.status(400).json({message:"Invalid password"});
            }
            if(newPassword.length<6){
                return res.status(400).json({message:"Password should be atleast 6 characters long"});
            }
            const salt=await bcrypt.genSalt(10);
            user.password=await bcrypt.hash(newPassword,salt);  
        }
        if(profileImg){
            if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse=await cloudinary.uploader.upload(profileImg)
            profileImg=uploadedResponse.secure_url;
        }
        if(coverImg){
            if(user.coverImg){
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }
            const uploadedResponse=await cloudinary.uploader.upload(coverImg)
            coverImg=uploadedResponse.secure_url;
        }
        user.username=username || user.username;
        user.email=email || user.email;
        user.fullname=req.body.fullname || user.fullname;
        user.bio=bio || user.bio;
        user.link=link || user.link;
        user.profileImg=profileImg || user.profileImg;
        user.coverImg=coverImg || user.coverImg;

        user=await user.save();
        user.password=null;

        return res.status(200).json({message:"Profile updated successfully",user});
        
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}