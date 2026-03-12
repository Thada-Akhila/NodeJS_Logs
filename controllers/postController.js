import Log from "../models/Logs.js";

import  logQueue  from "../utils/logQueue.js";

export const addLog = async (req, res) => {
  try {
    const { level, message, source } = req.body;

    if (!level || !message || !source) {
      return res.status(400).json({
        success: false,
        message: "level, message, source required"
      });
    }

    logQueue.push({
      level,
      message,
      source,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Log added to queue"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


export const getLogs = async (req, res) => {
  try {

    let {
      page=1,
      limit=10,
      search = "",
      sort
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    let query = {};

    // SEARCH
    if (search) {
      query.message = { $regex: search, $options: "i" };
    }

    // SORT
    let sortOption = { createdAt: -1 };

    
    if (sort === "newest") sortOption = { createdAt: -1 };

    const logs = await Log.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Log.countDocuments(query);

    res.json({
      page,
      total,
      totalPages: Math.ceil(total / limit),
      data: logs
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};