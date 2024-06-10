import express from 'express';
import {createPost,deletePost,commentOnPost,likeandunlike,gteAllPosts,getLikedPosts,getFollowingPosts,getUserPosts} from '../controllers/post.controllers.js';
import {protectRoute} from '../middleware/protectRoute.js';

const Router = express.Router();
Router.get("/likes/:id",protectRoute,getLikedPosts);
Router.get("/following",protectRoute,getFollowingPosts);
Router.get("/getAll",protectRoute,gteAllPosts); 
Router.get("/user/:username",protectRoute,getUserPosts);
Router.post("/create",protectRoute,createPost);
Router.delete("/:id",protectRoute,deletePost);
Router.post("/like/:id",protectRoute,likeandunlike);
Router.post("/comment/:id",protectRoute,commentOnPost);

export default Router;