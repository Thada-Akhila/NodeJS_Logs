import Log from "../models/Logs.js";
import { logQueue } from "./logQueue.js";

const BATCH_SIZE = 100;

export const startLogWorker = () => {
  setInterval(async () => {

    if (logQueue.length === 0) return;

    const logsToInsert = logQueue.splice(0, BATCH_SIZE);

    try {
      await Log.insertMany(logsToInsert);
      console.log(`Inserted ${logsToInsert.length} logs`);
    } catch (error) {
      console.error("Batch insert failed:", error);
    }

  }, 2000);
};