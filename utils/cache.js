import redisClient from "../configs/redis.js";

export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Cache GET error:", err);
    return null;
  }
};

export const setCache = async (key, value, ttl = 60) => {
  try {
    await redisClient.set(key, JSON.stringify(value), "EX", ttl);
  } catch (err) {
    console.error("Cache SET error:", err);
  }
};