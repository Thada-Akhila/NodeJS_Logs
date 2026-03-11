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

---

# 🛠 Tech Stack

| Technology    | Purpose             |
| ------------- | ------------------- |
| Node.js       | Runtime environment |
| Express.js    | API server          |
| MongoDB Atlas | Cloud database      |
| Mongoose      | MongoDB ODM         |
| JavaScript    | Application logic   |

---

# 🏗 System Architecture

Initial architecture:

```
Client Request
      ↓
POST /api/logs
      ↓
Express API
      ↓
MongoDB insert
```

This means:

```
1 request → 1 database write
```

Under heavy traffic this can create **database bottlenecks**.

To improve performance, the system later introduces **log batching with a queue and background worker**.

Optimized architecture:

```
Client Request
      ↓
API Server
      ↓
Log Queue (Memory)
      ↓
Background Worker
      ↓
Batch Insert → MongoDB
```

This reduces database load significantly.

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
│   └── db.js
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
│       └── day-3-log-batching.md
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

When a request arrives:

1. Validate request body
2. Add timestamp
3. Store log entry
4. Return success response

### Example Response

```json
{
  "success": true,
  "data": {
    "level": "info",
    "message": "User logged in",
    "source": "auth-service",
    "timestamp": "2026-03-05T12:32:27.345Z"
  }
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

A script was created to simulate **high traffic** by sending thousands of requests to the logging API.

Example load test script:

```javascript
import axios from "axios";

const URL = "http://localhost:3001/api/logs";

async function sendLogs() {
  const requests = [];

  for (let i = 0; i < 10000; i++) {
    requests.push(
      axios.post(URL, {
        level: "info",
        message: "Load testing log",
        source: "load-test-script"
      })
    );
  }

  await Promise.all(requests);

  console.log("Finished sending logs 🚀");
}

sendLogs();
```

---

# 📊 Performance Observations

During load testing the following behaviors were observed.

### CPU Usage

CPU usage increased significantly while handling thousands of concurrent requests.

Reasons:

* HTTP request processing
* JSON parsing
* MongoDB write operations

---

### MongoDB Writes

MongoDB successfully stored all **10,000 logs**.

However writes were slower because the system performed:

```
1 request → 1 database insert
```

This highlights the need for **batch processing** in high-traffic systems.

---

# ⚡ Performance Optimization

To improve performance, the system introduces **log batching**.

Instead of writing logs individually:

```
10,000 requests → 10,000 inserts
```

The optimized system performs:

```
10,000 requests → ~100 batch inserts
```

This dramatically reduces:

* database load
* CPU usage
* network overhead

---

# 🧠 Key Backend Concepts Learned

This project demonstrates several important backend engineering concepts:

* Node.js **event loop and concurrency**
* Handling **large numbers of API requests**
* **Load testing** backend systems
* Observing **runtime performance**
* Using **batch processing for optimization**

---

# 📚 Learning Documentation

Detailed daily learning notes are documented in the repository:

* Day 1 – Node.js Event Loop
* Day 2 – Load Testing the Logging API
* Day 3 – Log Queue & Batch Insert Optimization

Location:

```
docs/learning/
```

These documents include:

* concept explanations
* code examples
* architecture diagrams
* performance observations

---

# 🚀 Future Improvements

Possible improvements include:

* implementing **Redis queues**
* introducing **rate limiting**
* adding **log filtering**
* scaling background workers
* integrating **Kafka or RabbitMQ**

These improvements would allow the system to handle **millions of logs per minute**.

---

# 👩‍💻 Author

**Akhila Thada**
Backend Developer

---

# ⭐ Conclusion

This project demonstrates how to build a **scalable logging API** capable of handling **thousands of concurrent requests** using Node.js.

It also highlights how backend engineers evaluate and improve system performance through:

* load testing
* runtime observation
* architectural optimization.
