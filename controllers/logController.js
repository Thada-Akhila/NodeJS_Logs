import Log from "../models/Log.js";
import redisClient from "../configs/redis.js";
import { getCache, setCache } from "../utils/cache.js";

export const addLog = async (req, res) => {
  try {
    const { level, message, source } = req.body;

    if (!level || !message || !source) {
      return res.status(400).json({
        success: false,
        message: "level, message, source required"
      });
    }

    const log = JSON.stringify({
      level,
      message,
      source,
      timestamp: new Date()
    });

    // Push to Redis Queue
    await redisClient.lpush("logs_queue", log);

    //  Invalidate cache using tracked keys (BEST APPROACH)
    const keys = await redisClient.smembers("logs_cache_keys");

    if (keys.length > 0) {
      await redisClient.del(...keys);
    }

    await redisClient.del("logs_cache_keys");

    res.status(201).json({
      success: true,
      message: "Log added to Redis queue"
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
      page = 1,
      limit = 10,
      search = "",
      sort
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    // SEARCH
    let query = {};
    if (search) {
      query.message = { $regex: search, $options: "i" };
    }

    // SORT
    let sortOption = { createdAt: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    //  Unique cache key
    const cacheKey = `logs:${page}:${limit}:${search || "all"}:${sort || "default"}`;

    // 1. Try cache
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log("⚡ Cache HIT");
      return res.json(cached);
    }

    // 2. DB hit
    console.log("🐢 Cache MISS → DB hit");

    const logs = await Log.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Log.countDocuments(query);

    const responseData = {
      page,
      total,
      totalPages: Math.ceil(total / limit),
      data: logs
    };

    // 3. Save cache
    await setCache(cacheKey, responseData, 60);

    //  Track cache key
   
    if (cacheKey) {
  await redisClient.sadd("logs_cache_keys", cacheKey);
}

    res.json(responseData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};