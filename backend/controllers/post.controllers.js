import Post from "../models/post.models.js";
import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";
import { v2 as cloudinary } from "cloudinary";
export const createPost = async (req, res) => {
    try {
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!text && !img) {
            return res.status(400).json({ message: "Please enter text or image" });
        }
        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }
        const newPost = new Post({
            user: userId,
            text,
            img
        });
        await newPost.save();
        return res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const deletePost = async (req, res) => {
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        if(post.user.toString()!==req.user._id.toString()){
            return res.status(401).json({message:"You are not authorized to delete this post"});
        }
        if(post.img){
            const imgName=post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgName);
        }
        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"Post deleted successfully"});
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const {text} = req.body;
        const postId=req.params.id;
        const userId = req.user._id;
        if(!text){
            return res.status(400).json({message:"Please enter text"});
        }
        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        const  comment={
            text,
            user:userId
        }
        post.comments.push(comment);
        await post.save();
        return res.status(201).json({message:"Comment added successfully",post});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const likeandunlike = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const userLiked=post.likes.includes(userId);    
         if(userLiked){
            await Post.updateOne({_id:postId},{$pull:{likes:userId}});
            await User.updateOne({_id:userId},{$pull:{likedPosts:postId}});
            res.status(200).json({message:"Post unliked successfully"});
        }
        else{
             post.likes.push(userId);
            await post.save();
            await User.updateOne({_id:userId},{$push:{likedPosts:postId}});
            const notification=new Notification({   
                from:userId,
                to:post.user,
                type:"like",
            });
            await notification.save();
            res.status(200).json({message:"Post liked successfully"});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const gteAllPosts = async (req, res) => {
    try {
      const posts=await Post.find().sort({createdAt:-1}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        
      });
      if(posts.length===0){
          return res.status(201).json([]);
      }
      res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getLikedPosts = async (req, res) => {
   const userId=req.params.id;
   try {
      const user= await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const likedPosts=await Post.find({_id:{$in:user.likedPosts}}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        });
        res.status(200).json(likedPosts);
   } catch (error) {
    res.status(500).json({ message: error.message });
   } 
}

export const getFollowingPosts = async (req, res) => {
    try {
       const userId=req.user._id;
       const user=await User.findById(userId);
       if(!user){
           return res.status(404).json({message:"User not found"});
       }
       const following=user.following;
       const feedPosts=await Post.find({user:{$in:following}}).sort({createdAt:-1}).populate({
        path:"user",
        select:"-password"
    }).populate({
        path:"comments.user",
        select:"-password"
    });
    res.status(200).json(feedPosts);

    } catch (error) {
       res.status(500).json({ message: error.message }); 
    }
} 
export const getUserPosts = async (req, res) => {
    const username=req.params.username;
    try {
        const user=await User.findOne({username});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const posts=await Post.find({user:user._id}).sort({createdAt:-1}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } 
}