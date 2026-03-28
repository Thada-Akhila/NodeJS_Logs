import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: true,
      enum: ["info", "warn", "error", "debug"], // optional restriction
      lowercase: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    source: {
      type: String,
      required: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

const Log = mongoose.model("Log", logSchema);

export default Log;