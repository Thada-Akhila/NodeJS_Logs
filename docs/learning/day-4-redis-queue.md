# 📅 Day 4 – Redis Queue + Background Worker

---

# 🎯 Objective

Learn how to use **Redis as a queue system** to improve backend performance and make the API **non-blocking and scalable**.

---

# 🚀 Problem (Before Redis)

Previously, our API directly stored logs in MongoDB:

```
Client → API → MongoDB
```

### Issues:

* Slow API response under heavy load
* High CPU usage
* Too many database writes (1 request = 1 DB call)
* Not scalable

---

# 💡 Solution (Redis Queue)

We introduced **Redis as an intermediate queue layer**:

```
Client → API → Redis → Worker → MongoDB
```

---

# ⚙️ Implementation

## 1️⃣ Redis Setup

Connected to Redis Cloud using `ioredis`:

```javascript
import Redis from "ioredis";

const redisClient = new Redis(
  "redis://username:password@host:port"
);

export default redisClient;
```

---

## 2️⃣ Log Ingestion (Producer)

Instead of writing to MongoDB:

```javascript
await redisClient.lpush("logs_queue", JSON.stringify(log));
```

### Key Idea:

* API becomes **fast**
* No database blocking
* Just pushes data into queue

---

## 3️⃣ Background Worker (Consumer)

A worker continuously processes logs:

```javascript
setInterval(async () => {
  const logs = [];

  for (let i = 0; i < 100; i++) {
    const log = await redisClient.rpop("logs_queue");
    if (!log) break;
    logs.push(JSON.parse(log));
  }

  if (logs.length > 0) {
    await Log.insertMany(logs);
  }

}, 2000);
```

---

## 4️⃣ Batch Processing

Instead of inserting one log:

```
❌ insertOne()
```

We use:

```
✅ insertMany(logs)
```

### Benefits:

* Reduced database load
* Faster writes
* Efficient performance

---

# 🧪 Load Testing

Used a script to send **10,000 requests**:

```javascript
await Promise.all(batchRequests);
```

### Observations:

* API responded quickly ✅
* Redis handled high traffic ✅
* Logs were inserted in batches ✅
* No server crash ✅

---

# 📊 Key Learnings

## 🔹 1. Producer-Consumer Pattern

* API = Producer
* Worker = Consumer

---

## 🔹 2. Non-Blocking Architecture

Node.js remains fast because:

* No direct DB writes
* Uses async queue

---

## 🔹 3. Queue-Based Systems

Used in real-world systems like:

* Logging services
* Notification systems
* Payment processing

---

## 🔹 4. Performance Optimization

Batching reduces:

* DB calls
* CPU usage
* Response time

---

# ⚠️ Challenges Faced

* Redis connection errors (TLS / port issues)
* Wrong environment variables
* ECONNREFUSED (wrong port in load test)
* SSL errors → fixed using correct Redis URL

---

# ✅ Final Outcome

✔ Fast API responses
✔ Redis queue working
✔ Background worker processing logs
✔ Batch inserts into MongoDB
✔ Successfully handled high load

---

# 🚀 Next Step

➡️ Day 5: **Rate Limiting using Redis**

---
