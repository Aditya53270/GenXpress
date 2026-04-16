import express from "express";
import cors from "cors";
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";
import contentRouter from "./routes/contentRoutes.js";
import { startScheduleCron } from "./services/schedulerService.js";

const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use(cors());

try {
    await connectDB();
} catch (error) {
    console.error("Unable to start server due to MongoDB connection failure.", error?.message || error);
    process.exit(1);
}

app.use('/api/user',userRouter);
app.use('/api/image',imageRouter);
app.use("/api", contentRouter);
startScheduleCron();


app.get('/',(req,res)=> res.send('Hello, World! fine'));
app.listen(port, () => console.log('Server running on port'+port));


