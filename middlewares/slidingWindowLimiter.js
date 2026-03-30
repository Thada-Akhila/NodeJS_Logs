import redisClient from "../configs/redis.js";

export const slidingWindowLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;

    const WINDOW_SIZE = 60; // seconds
    const MAX_REQUESTS = 200;

    const key = `rate_limit:${ip}`;
    const now = Date.now();

    // 1. Remove old requests
    await redisClient.zRemRangeByScore(
      key,
      0,
      now - WINDOW_SIZE * 1000
    );

    // 2. Count current requests
    const currentRequests = await redisClient.zCard(key);

    if (currentRequests >= MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: "Too many requests (Sliding Window)"
      });
    }

    // 3. Add current request
    await redisClient.zAdd(key, {
      score: now,
      value: `${now}-${Math.random()}`
    });

    // 4. Set expiry
    await redisClient.expire(key, WINDOW_SIZE);

    next();

  } catch (error) {
    console.error("Sliding window error:", error);
    next();
  }
};