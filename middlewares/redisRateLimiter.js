import redisClient from "../configs/redis.js";

export const redisRateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;

    const WINDOW_SIZE = 60; // seconds
    const MAX_REQUESTS = 200; // limit per window

    const key = `rate_limit:${ip}`;

    // Get current count
    const current = await redisClient.get(key);

    if (current && parseInt(current) >= MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: "Too many requests (Redis limiter)"
      });
    }

    // Increment count
    await redisClient.incr(key);

    // Set expiry if first request
    if (!current) {
      await redisClient.expire(key, WINDOW_SIZE);
    }
    console.log(`IP: ${ip}, Count: ${current}`);

    next();

  } catch (error) {
    console.error("Rate limiter error:", error);
    next(); // fail open (important in production)
  }
};