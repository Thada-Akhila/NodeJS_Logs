import redisClient from "../configs/redis.js";

export const slidingWindowLimiter = async (req, res, next) => {
  try {
    const key = `rate_limit:${req.ip}`;
    const windowSize = 60 * 1000; // 1 min
    const maxRequests = 10;

    const now = Date.now();
    const windowStart = now - windowSize;

    // 1. Remove old requests
    await redisClient.zremrangebyscore(key, 0, windowStart);

    // 2. Count requests in window
    const requestCount = await redisClient.zcard(key);

    if (requestCount >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests (Sliding Window)"
      });
    }

    // 3. Add current request
    await redisClient.zadd(key, now, `${now}-${Math.random()}`);

    // 4. Set expiry
    await redisClient.expire(key, 60);

    next();

  } catch (error) {
    console.error("Sliding window error:", error);
    next();
  }
};