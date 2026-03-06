import Log from "../models/Logs.js";

export const addLog = async (req, res) => {
  try {
    const { level, message, source } = req.body;

    if(!level || !message || !source){
      return res.status(400).json({success:false, message: "all three level, message, source values required"});
    }

    const newLog = await Log.create({
      level,
      message,
      source
    });

    res.status(201).json({
      success: true,
      data: newLog
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


