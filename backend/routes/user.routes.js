import express from 'express';
import {protectRoute} from '../middleware/protectRoute.js';
import {getUserProfile,followandUnfollow,getSuggestedUsers,updateUserProfile} from '../controllers/user.controllers.js';
const Router = express.Router();

Router.get("/profile/:username",protectRoute,getUserProfile);
Router.get("/suggested",protectRoute,getSuggestedUsers);
Router.post("/follow/:id",protectRoute,followandUnfollow);
Router.post("/update",protectRoute,updateUserProfile);

export default Router;