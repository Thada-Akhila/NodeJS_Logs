import redisClient from "../configs/redis.js";

async function testRedis() {
  try {
    console.log("⏳ Testing Redis...");

    await redisClient.set("testKey", "Hello Redis");

    const value = await redisClient.get("testKey");

    console.log("✅ Redis Value:", value);

  } catch (error) {
    console.error("❌ Redis Error:", error);
  } finally {
    redisClient.disconnect();
  }
}

testRedis();