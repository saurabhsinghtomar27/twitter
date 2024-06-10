import mongoose from "mongoose";
const connectDb = async () => {
  try {
  const conn= await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected :", conn.connection.host);
  } catch (error) {
    console.log("Error connecting to the database", error);
  }
}
export default connectDb;
// yslFINC5V9pnUVgM
// mongodb+srv://saurabhsingh04822:yslFINC5V9pnUVgM@cluster0.ecae5nk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0