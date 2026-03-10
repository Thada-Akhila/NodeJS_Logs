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