import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './configs/db.js';
import logsRouter from './routes/postRoutes.js';
import { startLogWorker } from "./utils/logWorker.js";

dotenv.config();
connectDB();


const app = express();
app.use(express.json());



app.use('/api/logs', logsRouter);
startLogWorker();

const PORT = process.env.PORT || 3001;


app.get('/', (req,res)=>{
   res.json({success:true,
    message:'hello world'
   })
})


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})