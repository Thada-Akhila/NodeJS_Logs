# Day 3 – Log Queue & Batch Insert Optimization

## 🎯 Objective

Improve the performance of the logging API by reducing the number of database writes.

Instead of writing every log directly to MongoDB, logs are first stored in a **memory queue** and then inserted in **batches** using a background worker.

---

# 🧠 Problem with Direct Database Writes

Initial implementation worked like this:

```
Client Request
      ↓
POST /api/logs
      ↓
MongoDB insert
```

This means:

```
1 request → 1 database write
```

Example:

```
10,000 requests → 10,000 MongoDB inserts
```

Problems:

* high CPU usage
* database overload
* slower write performance
* poor scalability

---

# ⚡ Optimization Strategy

Introduce a **log queue and batch insert system**.

New architecture:

```
Client Request
      ↓
API Server
      ↓
Log Queue (in memory)
      ↓
Background Worker
      ↓
Batch Insert to MongoDB
```

Now the system works like:

```
100 logs → 1 database insert
```

This dramatically reduces database load.

---

# 📦 Required Packages

No new packages are required.

This system uses:

* Node.js built-in features
* MongoDB with Mongoose

Dependencies already installed:

```
npm install express mongoose cors dotenv
```

---

# 📂 Updated Project Structure

```
NodeJs_Logs_Project
│
├── controllers
│   └── logController.js
│
├── models
│   └── Log.js
│
├── routes
│   └── logRoutes.js
│
├── utils
│   ├── logQueue.js
│   └── logWorker.js
│
├── scripts
│   └── loadTest.js
│
├── docs
│   └── learning
│       └── day-3-log-batching.md
│
├── server.js
└── README.md
```

---

# 🧩 Step 1 – Create Log Queue

File:

```
utils/logQueue.js
```

Code:

```javascript
export const logQueue = [];
```

This queue temporarily stores logs before they are written to MongoDB.

---

# 🧩 Step 2 – Modify the Log Controller

Instead of inserting logs directly into MongoDB, push them into the queue.

File:

```
controllers/logController.js
```

Example code:

```javascript
import { logQueue } from "../utils/logQueue.js";

export const addLog = async (req, res) => {
  try {
    const { level, message, source } = req.body;

    if (!level || !message || !source) {
      return res.status(400).json({
        success: false,
        message: "level, message, source required"
      });
    }

    logQueue.push({
      level,
      message,
      source,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      message: "Log added to queue"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
```

Now the API responds quickly because it **does not wait for a database write**.

---

# 🧩 Step 3 – Create Background Worker

File:

```
utils/logWorker.js
```

Code:

```javascript
import Log from "../models/Log.js";
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
```

The worker runs every **2 seconds** and inserts logs in batches.

---

# 🧩 Step 4 – Start the Worker

Update `server.js`.

Example:

```javascript
import { startLogWorker } from "./utils/logWorker.js";

startLogWorker();
```

Now the worker starts automatically when the server starts.

---

# 🧪 Testing the Optimization

Run the load testing script again.

Start server:

```
node server.js
```

Run load test:

```
node scripts/loadTest.js
```

---

# 📊 Observations

### Server Logs

Console output showed batch insert messages:

```
Inserted 100 logs
Inserted 100 logs
Inserted 100 logs
```

---

### Database Writes

MongoDB received **fewer but larger writes** instead of many small writes.

Example:

```
Before:
10,000 requests → 10,000 inserts

After:
10,000 requests → ~100 inserts
```

---

### CPU Usage

CPU usage improved because the server no longer performs a database write for every request.

---

# ⚠️ Trade-off

Batching introduces a small delay.

Example:

```
User sends log
↓
Log stored in queue
↓
Worker inserts after 2 seconds
```

This means logs may not appear **instantly** in the database.

This is called **eventual consistency**.

---

# 🌍 Real-World Systems Using This Pattern

Many large-scale systems use similar approaches:

* log aggregation platforms
* analytics pipelines
* event processing systems
* monitoring services

Often these systems use **message queues** like:

* Redis
* Kafka
* RabbitMQ

---

# 🧠 Key Learnings

1️⃣ Writing to the database for every request is inefficient under heavy load.

2️⃣ Using a queue allows the server to process requests quickly.

3️⃣ Batch inserts significantly reduce database overhead.

4️⃣ Background workers are commonly used for asynchronous processing.

---

# 🚀 Future Improvements

Possible improvements include:

* using **Redis queues**
* implementing **rate limiting**
* adding **log filtering**
* scaling workers horizontally
* integrating **message brokers (Kafka, RabbitMQ)**

---

# 📚 Conclusion

The log batching system improved the performance and scalability of the logging API.

By introducing a queue and background worker, the system can handle **high volumes of log requests while reducing database load**.

This pattern is widely used in modern backend architectures to improve system throughput.
