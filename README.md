# 🚀 High Performance Logs API

## 📌 Overview

A **production-grade logging system** designed to handle **high-volume concurrent requests** using Node.js.

This project simulates real-world backend systems where multiple services generate logs simultaneously, and focuses on **scalability, performance, and system design concepts**.

---

# 🎯 Key Features

* High-throughput log ingestion API
* Redis-based queue system
* Background worker for batch processing
* MongoDB storage with pagination
* Load testing for performance analysis
* Advanced rate limiting strategies

---

# 🛠 Tech Stack

| Technology    | Purpose            |
| ------------- | ------------------ |
| Node.js       | Runtime            |
| Express.js    | API framework      |
| MongoDB Atlas | Database           |
| Mongoose      | ODM                |
| Redis         | Queue + Rate Limit |

---

# 🏗 System Architecture

## 🔹 Initial Approach

```
Client → API → MongoDB (1 request = 1 write)
```

Problem:

* High database load
* Poor scalability

---

## 🔹 Optimized Architecture

```
Client
  ↓
API Server
  ↓
Redis Queue
  ↓
Background Worker
  ↓
Batch Insert → MongoDB
```

---

# ⚡ Performance Optimization

### Before:

```
10,000 requests → 10,000 DB writes
```

### After:

```
10,000 requests → ~100 batch inserts
```

---

# 🧪 Load Testing

Custom script used to simulate thousands of concurrent requests.

### Observations:

* High CPU usage during load
* Database bottleneck in naive approach
* Improved performance with batching

---

# 🛡 Rate Limiting Evolution

## Day 5 – Basic Rate Limiting

* Used express-rate-limit
* In-memory limiting
* Not scalable

---

## Day 6 – Redis Rate Limiting

* Distributed rate limiting
* Atomic counters using Redis
* Works across multiple servers

---

## Day 7 – Sliding Window Rate Limiter (Final)

* Uses Redis Sorted Sets
* Tracks request timestamps
* Prevents burst traffic
* Production-grade solution

---

# 📂 Project Structure

```
project
│
├── controllers
├── models
├── routes
├── configs
├── middlewares
│   ├── rateLimiter.js
│   ├── redisRateLimiter.js
│   └── slidingWindowLimiter.js
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
│       ├── day-1-node-event-loop.md
│       ├── day-2-load-testing.md
│       ├── day-3-log-batching.md
│       ├── day-5-rate-limiting.md
│       ├── day-6-redis-rate-limiting.md
│       └── day-7-sliding-window-rate-limiter.md
│
└── server.js
```

---

# 🧠 Backend Concepts Demonstrated

* Event Loop & Non-blocking I/O
* High concurrency handling
* Load testing & performance tuning
* Queue-based architecture
* Batch processing
* Distributed rate limiting
* Sliding window algorithms

---

# 🚀 Future Improvements

* Token Bucket rate limiter
* Kafka / RabbitMQ integration
* Horizontal scaling
* API Gateway integration

---

# 👩‍💻 Author

**Akhila Thada**
Backend Developer

---

# ⭐ Final Thoughts

This project demonstrates how real backend systems are designed to:

* handle high traffic
* prevent overload
* scale efficiently
* maintain performance under stress

It reflects **practical backend engineering and system design thinking**.
