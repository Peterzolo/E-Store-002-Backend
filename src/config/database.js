import mongoose from "mongoose";

const databaseConn = async () => {
  try {
    const mongoDBCon = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Could not connect to database");
  }
};

export default databaseConn;
