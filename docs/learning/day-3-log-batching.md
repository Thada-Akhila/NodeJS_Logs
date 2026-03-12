# Day 3 — Log Batching & Queue Processing

## 🎯 Goal

Improve the logging API performance by **reducing the number of database writes**.

Previously, the system inserted logs directly into MongoDB.

```
Request → MongoDB insert
```

This caused performance issues when handling **thousands of requests**.

---

# 🧠 Problem

When running the load test with **10,000 requests**, the system performed:

```
10,000 API requests
10,000 MongoDB writes
```

This resulted in:

* Increased CPU usage
* Slow database writes
* Potential database overload

Each request created an individual write operation.

---

# 🚀 Solution — Queue + Batch Processing

Instead of inserting logs immediately, logs are first placed into an **in-memory queue**.

Architecture:

```
Client Request
      ↓
POST /api/logs
      ↓
Log Queue (Memory)
      ↓
Background Worker
      ↓
Batch Insert → MongoDB
```

---

# 📦 Queue Implementation

A simple **in-memory queue** was created.

File:

```
utils/logQueue.js
```

```javascript
export const logQueue = [];
```

When a log request arrives, it is added to the queue instead of being written directly to the database.

```javascript
logQueue.push({
  level,
  message,
  source,
  timestamp: new Date()
});
```

---

# ⚙ Background Worker

A background worker processes the queue and inserts logs into MongoDB in batches.

File:

```
utils/logWorker.js
```

Example:

```javascript
const BATCH_SIZE = 100;

setInterval(async () => {

  if (logQueue.length === 0) return;

  const logsToInsert = logQueue.splice(0, BATCH_SIZE);

  await Log.insertMany(logsToInsert);

}, 2000);
```

This means:

```
100 logs → 1 database insert
```

---

# 📊 Performance Improvement

Before batching:

```
10,000 requests
10,000 database writes
```

After batching:

```
10,000 requests
≈100 database writes
```

Benefits:

* Reduced database load
* Faster API response
* Better scalability

---

# 🧠 Backend Architecture Pattern

This system follows the **Producer–Consumer pattern**.

```
API (Producer)
      ↓
Queue (Buffer)
      ↓
Worker (Consumer)
      ↓
Database
```

This pattern is widely used in production systems such as:

* logging systems
* analytics pipelines
* notification services
* message processing systems

---

# ⚠ Limitations

Current queue is **in-memory**, which means:

* logs may be lost if the server crashes
* not suitable for distributed systems

Production systems typically use:

* Redis
* Kafka
* RabbitMQ

---

# 📚 Key Concepts Learned

* Queue-based processing
* Batch database inserts
* Producer–Consumer architecture
* Performance optimization for high-volume APIs
* Background workers in Node.js

---

# 🚀 Next Improvements

Future improvements may include:

* Redis-based queue
* distributed workers
* rate limiting
* log filtering
* streaming logs

These improvements would make the logging system more **production ready**.
