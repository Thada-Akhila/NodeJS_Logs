import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import logsRouter from "./routes/logRoutes.js";
import authRoutes from './routes/authRoutes.js'
import { startLogWorker } from "./utils/logWorker.js";
import redisClient from "./configs/redis.js";
import { sessionMiddleware } from "./configs/session.js";

const app = express();
app.use(express.json());

app.use(sessionMiddleware);


app.use('/api/auth', authRoutes);
app.use('/api/logs', logsRouter);
startLogWorker();

const PORT = process.env.PORT || 3001;


app.get('/', (req,res)=>{
   res.json({success:true,
    message:'hello world'
   })
})



const startServer = async () => {
  try {
    await connectDB();

    // ✅ Test Redis here (controlled execution)
    await redisClient.set("test", "hello");
    const value = await redisClient.get("test");
    console.log("Redis Test:", value);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Startup Error:", error);
  }
};

startServer();