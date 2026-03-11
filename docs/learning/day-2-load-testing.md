# Day 2 – Load Testing the Logging API

## 🎯 Objective

Test how the logging API behaves under **heavy traffic** by sending thousands of requests.

Goals:

* simulate high traffic
* observe server performance
* observe database writes
* understand limitations of concurrent requests

---

# 🧠 Why Load Testing is Important

In production systems, APIs may receive **thousands of requests per second**.

Without testing, systems may fail due to:

* high CPU usage
* database overload
* memory exhaustion
* network limits

Load testing helps identify **performance bottlenecks before production deployment**.

---

# ⚙️ System Being Tested

Logging API endpoint:

```
POST /api/logs
```

Example request body:

```json
{
  "level": "info",
  "message": "User logged in",
  "source": "auth-service"
}
```

Each request stores a log entry in **MongoDB Atlas**.

---

# 📦 Required Packages

Install HTTP client package:

```
npm install node-fetch
```

This package is used to send API requests from a script.

---

# 📂 Project Structure

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
├── scripts
│   └── loadTest.js
│
├── docs
│   └── learning
│       └── day-2-load-testing.md
│
├── server.js
└── README.md
```

---

# 🧪 Load Testing Script

File:

```
scripts/loadTest.js
```

Example code:

```javascript
import fetch from "node-fetch";

const URL = "http://localhost:3001/api/logs";

const TOTAL_REQUESTS = 10000;

async function sendLogs() {
  const requests = [];

  for (let i = 0; i < TOTAL_REQUESTS; i++) {
    requests.push(
      fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          level: "info",
          message: "Load test log",
          source: "load-test"
        })
      })
    );
  }

  await Promise.all(requests);

  console.log("Finished sending logs 🚀");
}

sendLogs();
```

---

# ▶️ Running the Load Test

Start the API server:

```
node server.js
```

Run the load testing script:

```
node scripts/loadTest.js
```

This script sends **10,000 concurrent POST requests** to the API.

---

# 📊 Observations

During testing, several system behaviors were observed.

### CPU Usage

CPU usage spiked significantly while processing thousands of requests.

Reason:

* many HTTP requests processed simultaneously
* JSON parsing
* database write operations

---

### MongoDB Atlas

MongoDB successfully stored all log entries.

However writes were **gradual and slower**, because:

```
1 request = 1 database insert
```

10,000 requests therefore created **10,000 separate write operations**.

---

### Server Performance

The server remained responsive but processed requests **slower under heavy load**.

This highlighted the cost of **frequent database writes**.

---

# ⚠️ Error Encountered

When increasing requests to **50,000**, the following error occurred:

```
ENOBUFS
```

Meaning:

```
No buffer space available
```

This happened because the script attempted to open **too many network connections at once**.

---

# 🛠 Solution – Controlled Concurrency

Instead of sending all requests simultaneously, requests were sent **in smaller batches**.

Example approach:

```
100 requests → wait → next 100 requests
```

This prevents overwhelming:

* the operating system
* the Node.js server
* the network stack

---

# 🧠 Key Learnings

1️⃣ APIs must be tested under heavy traffic to identify performance issues.

2️⃣ Sending too many concurrent requests can overwhelm system resources.

3️⃣ Database writes are often a **major performance bottleneck**.

4️⃣ Large systems improve performance by using **batch inserts or queues**.

---

# 🚀 Next Optimization

To improve performance, the next step is to implement **log batching**.

Instead of:

```
1 request → 1 database write
```

Use:

```
multiple logs → batch insert
```

This reduces database load and increases throughput.

This improvement is implemented in **Day 3 – Log Batching System**.
