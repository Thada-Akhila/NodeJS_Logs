# 🚀 High Performance Logs API

## 📌 Project Overview

This project implements a **high-performance logging API** designed to handle **high-volume log ingestion** without blocking the **Node.js event loop**.

The system simulates a **production-style logging service**, where thousands of logs can arrive concurrently from multiple services such as:

* authentication services
* payment systems
* analytics pipelines
* monitoring tools

Logs are stored in **MongoDB Atlas** and retrieved using **efficient pagination queries**.

The project also includes **load testing and performance optimization experiments** to understand how backend systems behave under heavy traffic.

---

# 🎯 Learning Goals

This project was built to practice important **backend engineering concepts**, including:

* Handling **high-volume API requests**
* Understanding **Node.js non-blocking architecture**
* Performing **API load testing**
* Observing **CPU and database behavior under stress**
* Implementing **pagination for large datasets**
* Improving performance with **batch processing**
* Using **Redis for scalable queue-based architecture**

---

# 🛠 Tech Stack

| Technology    | Purpose             |
| ------------- | ------------------- |
| Node.js       | Runtime environment |
| Express.js    | API server          |
| MongoDB Atlas | Cloud database      |
| Mongoose      | MongoDB ODM         |
| Redis         | In-memory queue     |
| ioredis       | Redis client        |
| JavaScript    | Application logic   |

---

# ⚡ Redis Integration (Day 4)

To improve performance, Redis is used as a **queue system**.

### Flow:

1. API receives log request
2. Log is pushed to Redis queue
3. Background worker pulls logs in batches
4. Logs are inserted into MongoDB

### Example (Producer)

```javascript
await redisClient.lpush("logs_queue", JSON.stringify(log));
```

### Example (Worker)

```javascript
const log = await redisClient.rpop("logs_queue");
```

### Benefits:

* Non-blocking API
* High throughput
* Reduced database load
* Better scalability

---

# 🏗 System Architecture

## Initial Architecture

```
Client Request
      ↓
POST /api/logs
      ↓
Express API
      ↓
MongoDB insert
```

```
1 request → 1 database write
```

This approach creates **database bottlenecks under high traffic**.

---

## Optimized Architecture (With Redis Queue)

```
Client Request
      ↓
API Server (Express)
      ↓
Redis Queue (LPUSH)
      ↓
Background Worker (RPOP)
      ↓
Batch Insert → MongoDB
```

### Why Redis?

Redis acts as a **fast in-memory queue** between the API and database.

This ensures:

* Fast API responses (non-blocking)
* Asynchronous database processing
* High traffic handling via queue buffering
* Better scalability and fault tolerance

---

# 📂 Project Structure

```
project
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
├── configs
│   ├── db.js
│   └── redis.js
│
├── utils
│   └── logWorker.js
│
├── scripts
│   └── loadTest.js
│
├── docs
│   └── learning
│       ├── day-1-node-event-loop.md
│       ├── day-2-load-testing.md
│       ├── day-3-log-batching.md
│       └── day-4-redis-queue.md
│
├── server.js
└── README.md
```

---

# 🧩 Log Ingestion API

## Endpoint

```
POST /api/logs
```

### Example Request

```json
{
  "level": "info",
  "message": "User logged in",
  "source": "auth-service"
}
```

### Validation Rules

* `level` → required
* `message` → required
* `source` → required

### Server Processing

1. Validate request body
2. Add timestamp
3. Push log to Redis queue
4. Return success response

### Example Response

```json
{
  "success": true,
  "message": "Log added to Redis queue"
}
```

---

# 📄 Pagination API

```
GET /api/logs?page=1&limit=10
```

### Features

* Pagination support
* Sorted by newest logs
* Efficient MongoDB queries

### Example Response

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 100,
  "totalPages": 10,
  "data": []
}
```

---

# 🧪 Load Testing

A script was created to simulate **high traffic** by sending thousands of requests.

### Key Improvements

* Batch-based request sending
* Error handling
* Controlled concurrency

---

# 📊 Performance Observations

### CPU Usage

CPU usage increases during high traffic due to:

* HTTP request handling
* JSON parsing
* Queue operations

---

### MongoDB Writes

Before optimization:

```
10,000 requests → 10,000 inserts
```

After optimization:

```
10,000 requests → Redis queue → ~100 batch inserts
```

---

# ⚡ Performance Optimization

The system uses:

## 1️⃣ Log Batching

* Uses `insertMany()` instead of individual inserts

## 2️⃣ Redis Queue

* Decouples API from database

### Final Flow:

```
High traffic → Redis queue → Worker → Batch insert
```

### Benefits:

* Reduced database load
* Faster API responses
* Better scalability

---

# 🧠 Key Backend Concepts Learned

* Node.js **event loop & concurrency**
* Handling **high-volume API traffic**
* **Load testing backend systems**
* **Queue-based architecture (Redis)**
* **Batch processing for optimization**
* Designing **non-blocking systems**

---

# 📚 Learning Documentation

Daily learning notes are available in:

```
docs/learning/
```

### Covered Topics:

* Day 1 – Node.js Event Loop
* Day 2 – Load Testing
* Day 3 – Log Batching
* Day 4 – Redis Queue & Worker

---

# 🚀 Future Improvements

* Redis-based **rate limiting**
* Distributed queues (**BullMQ / Kafka**)
* Horizontal scaling (multiple workers)
* Advanced log filtering & analytics

---

# 👩‍💻 Author

**Akhila Thada**
Backend Developer

---

# ⭐ Conclusion

This project demonstrates how to build a **scalable, high-throughput logging API** using:

* Node.js (non-blocking architecture)
* Redis (queue system)
* MongoDB (efficient storage)

It highlights how backend engineers design systems that can handle **thousands of concurrent requests** while maintaining **performance and reliability**.

---
