import mongoose from "mongoose";

const  connectDB = async (url) => {
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected");
    })
    await mongoose.connect(`${process.env.MONGODB_URL}/imagingo`)
}
export default connectDB;