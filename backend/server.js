import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import connectDb from "./database/connect.db.js";
import NotificationRoutes from "./routes/notifcation.routes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { v2 as cloudinary } from "cloudinary";
const app = express();
import cors from "cors";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINAY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// console.log(process.env.MONGO_URI);
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use("/api/auth",authroutes)
app.use('/api/users',userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/notification",NotificationRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server Running at http://localhost:${process.env.PORT}`);
  connectDb();
});