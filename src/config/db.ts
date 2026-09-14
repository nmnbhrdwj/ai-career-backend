import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://namanbharadwaj888_db_user:hT6UxYlMjCFGPVv2@cluster0.wnr3wr6.mongodb.net/?appName=Cluster0";
    await mongoose.connect(mongoUri, {
      dbName: "ai-career",
    });

    console.log("Connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
