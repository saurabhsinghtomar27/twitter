import { protectRoute } from "../middleware/protectRoute.js";
import express from "express";
import { getNotifications, deleteNotifications,deleteNotification } from "../controllers/notification.controllers.js";
const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);
router.delete("/:id", protectRoute, deleteNotification)


export default router;