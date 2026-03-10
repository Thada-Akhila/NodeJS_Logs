# 🚀 High Performance Logs API

## 📌 Project Overview

This project implements a **high‑performance logging API** capable of handling **large volumes of log ingestion requests** while ensuring that the **Node.js event loop is not blocked**. The system efficiently stores logs in MongoDB and supports **pagination for retrieving logs**.

The goal of this challenge is to simulate **real production logging systems** where thousands of logs may arrive every second.

---

# 🎯 Objectives

* Accept **high‑volume log entries**
* Store logs efficiently in **MongoDB**
* Return **paginated log results**
* Ensure **non‑blocking event loop**
* Handle **load testing (10,000+ requests)**

---

# 🛠 Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JavaScript**

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
├── scripts
│   └── loadTest.js
│
├── server.js
└── README.md
```

---

# 🧩 TASK 1 – Log Ingestion API

## Endpoint

```
POST /api/logs
```

### Request Body

```json
{
  "level": "info",
  "message": "User logged in",
  "source": "auth-service"
}
```

### Validation Rules

* `level` is required
* `message` is required
* `source` is required

### Server Processing

1. Validate request body
2. Add `timestamp`
3. Save log to MongoDB
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
* Efficient database queries

---

# 🧩 TASK 2 – High Volume Load Test

A script was created to simulate **10,000 log requests** to test the server's performance.

### Example Script (Node.js)

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
  console.log("Finished sending logs");
}

sendLogs();
```

---

# 📊 Performance Observations

During load testing the following metrics should be monitored:

### 1️⃣ CPU Usage

Open **Task Manager → Performance → CPU** to observe spikes.

### 2️⃣ Memory Usage

Check if memory consumption increases significantly during load.

### 3️⃣ Server Logs

Observe if requests start slowing down or failing.

### 4️⃣ MongoDB Writes

Verify whether all logs are stored correctly in the database.

---

# ⚡ Performance Considerations

To keep the API performant:

* Use **async/await (non‑blocking operations)**
* Avoid synchronous code
* Use **efficient MongoDB queries**
* Implement **pagination** for log retrieval

---

# ✅ Task Completion Status

| Task                                  | Status        |
| ------------------------------------- | ------------- |
| Setup Node.js + Express server        | ✅ Completed   |
| MongoDB connection                    | ✅ Completed   |
| Log schema creation                   | ✅ Completed   |
| POST /api/logs API                    | ✅ Completed   |
| Input validation                      | ✅ Completed   |
| Timestamp generation                  | ✅ Completed   |
| Log storage in MongoDB                | ✅ Completed   |
| Pagination API                        | ✅ Completed   |
| Load testing script (10,000 requests) | ✅ Implemented |
| Performance observation               | ⏳ In Progress |

---

# 🚀 Future Improvements

* Implement **log batching** for even better performance
* Add **rate limiting**
* Add **log filtering (level/source)**
* Implement **Redis queue (BullMQ / Kafka)** for massive scale

---

# 👩‍💻 Author

**Akhila Thada**
Backend Developer

---

# ⭐ Conclusion

This project demonstrates how to build a **high‑throughput logging API** capable of handling **thousands of requests without blocking the Node.js event loop**, while efficiently storing and retrieving logs using MongoDB.
