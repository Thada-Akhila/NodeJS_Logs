import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const connected = await mongoose.connect(process.env.MONGO_URI);
        console.log(`database is connecred to ${connected.connection.host}`);
    } catch (error) {
        console.log(`Database connection faild: `,error.message);
        process.exit(1);
    }
}

export default connectDB;