import Redis from "ioredis";

const redisClient = new Redis(
  "redis://default:AA1N0VUamJ8SlUpoByNDf9gn3cq6Co6N@redis-10140.crce292.ap-south-1-2.ec2.cloud.redislabs.com:10140"
);

//global error logs in redis
redisClient.on("error", (err) => {
  console.error("🔥 Redis Error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
  console.log("❌ Redis FULL ERROR:", err);
});

export default redisClient;