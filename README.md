# 🚀 High Performance Logs API

## 📌 Project Overview

This project implements a **high-performance logging API** designed to handle **high-volume log ingestion** without blocking the **Node.js event loop**.

The system simulates a **production-style logging service**, where thousands of logs can arrive concurrently from multiple services (auth, payment, analytics, etc.).

The API stores logs efficiently in **MongoDB** and provides **pagination support** for retrieving logs.

This project also includes **load testing** to observe how the system behaves under heavy traffic.

---

# 🎯 Learning Goals

This project was built to practice **backend engineering concepts**, including:

* Handling **high-volume API requests**
* Understanding **Node.js non-blocking architecture**
* Performing **load testing**
* Observing **CPU and database behavior under stress**
* Implementing **efficient database queries with pagination**

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
2. Add `timestamp`
3. Store log in MongoDB
4. Return a success response

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
  "data": [...]
}
```

---

# 🧩 TASK 2 – High Volume Load Test

A script was created to simulate **10,000 log requests** to evaluate system performance.

### Example Load Test Script

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

During load testing, the following behaviors were observed:

### CPU Usage

CPU usage increased significantly during the test due to:

* Handling thousands of concurrent HTTP requests
* JSON parsing
* Database write operations

### MongoDB Writes

MongoDB successfully stored all **10,000 logs**, confirming that the API handled high concurrency.

### Request Processing

Logs were stored successfully, though **database writes occurred gradually**, highlighting the cost of performing **individual inserts for every request**.

---

# ⚡ Performance Considerations

To maintain high performance:

* Use **asynchronous operations**
* Avoid blocking the Node.js event loop
* Use **efficient MongoDB queries**
* Implement **pagination for large datasets**

---

# 🧠 Key Backend Concepts Learned

This project helped practice several important backend concepts:

* **Node.js Event Loop behavior**
* **Handling concurrent requests**
* **Non-blocking database operations**
* **Load testing APIs**
* **Backend performance observation**

---

# 🚀 Future Improvements

Planned improvements include:

* Implement **log batching (insertMany)**
* Add **rate limiting**
* Implement **log filtering**
* Introduce **background job queues**
* Use **Redis / message queues for large-scale logging systems**

---

# 👩‍💻 Author

**Akhila Thada**
Backend Developer

---

# ⭐ Conclusion

This project demonstrates how to build a **high-throughput logging API** capable of handling **thousands of concurrent requests** while maintaining a **non-blocking Node.js architecture**.

It also highlights how backend engineers evaluate system performance through **load testing and runtime observations**.
