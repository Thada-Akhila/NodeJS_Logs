import Log from "../models/Log.js";
import redisClient from "../configs/redis.js";

const BATCH_SIZE = 100;

export const startLogWorker = () => {

  setInterval(async () => {

    const logs = [];

    // 🔥 Fetch logs from Redis
    for (let i = 0; i < BATCH_SIZE; i++) {

      const log = await redisClient.rpop("logs_queue");

      if (!log) break;

      logs.push(JSON.parse(log));
    }

    if (logs.length === 0) return;

    try {

      await Log.insertMany(logs);

      console.log(
        `Inserted ${logs.length} logs from Redis queue`
      );

    } catch (error) {

      console.error("Batch insert failed:", error);

    }

  }, 2000);

};