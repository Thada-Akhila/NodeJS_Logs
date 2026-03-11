# Day 1 – Node.js Event Loop & Concurrency

## 🎯 Objective

Understand how **Node.js handles multiple operations concurrently even though it runs on a single thread**.

Topics covered:

* Node.js Event Loop
* Microtasks vs Macrotasks
* `process.nextTick()`
* `setTimeout()`
* `setImmediate()`
* Non-blocking architecture

---

# 🧠 What is the Node.js Event Loop?

Node.js uses a **single-threaded event-driven architecture**.

Instead of creating a new thread for every request, Node.js uses an **event loop** to handle asynchronous operations.

This allows Node.js to efficiently process **many requests at the same time**.

### Simplified Flow

```
Client Request
      ↓
Node.js Event Loop
      ↓
Non-blocking operations
      ↓
Callback execution
```

This design makes Node.js **very efficient for I/O-heavy applications** like APIs.

---

# ⚙️ Event Loop Phases

The Node.js event loop has several phases.

```
1️⃣ Timers
2️⃣ Pending Callbacks
3️⃣ Idle / Prepare
4️⃣ Poll
5️⃣ Check
6️⃣ Close Callbacks
```

### Important Phases

**Timers**

Handles:

```
setTimeout()
setInterval()
```

---

**Poll Phase**

Handles:

* incoming I/O
* database responses
* file reads

---

**Check Phase**

Handles:

```
setImmediate()
```

---

# ⚡ Microtasks vs Macrotasks

Node.js prioritizes **microtasks** before moving to the next phase.

### Microtasks

Executed immediately after the current operation.

Examples:

```
Promise.then()
process.nextTick()
```

### Macrotasks

Executed during event loop phases.

Examples:

```
setTimeout()
setImmediate()
I/O callbacks
```

### Execution Priority

```
1️⃣ process.nextTick
2️⃣ Promise callbacks
3️⃣ Timers (setTimeout)
4️⃣ setImmediate
```

---

# 🧪 Practical Experiment

To understand execution order, a small script was created.

## File

```
eventLoopTest.js
```

### Code

```javascript
console.log("Start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

setImmediate(() => {
  console.log("setImmediate");
});

Promise.resolve().then(() => {
  console.log("Promise");
});

process.nextTick(() => {
  console.log("nextTick");
});

console.log("End");
```

---

# ▶️ Run the Script

Command:

```
node eventLoopTest.js
```

---

# 📊 Observed Output

```
Start
End
nextTick
Promise
setTimeout
setImmediate
```

---

# 🔍 Explanation

Execution happens in this order:

### 1️⃣ Synchronous Code

```
console.log("Start")
console.log("End")
```

---

### 2️⃣ `process.nextTick()`

Runs before the event loop continues.

---

### 3️⃣ Promise Microtasks

Executed immediately after `nextTick`.

---

### 4️⃣ Timers Phase

```
setTimeout()
```

---

### 5️⃣ Check Phase

```
setImmediate()
```

---

# 📂 Example Folder Structure

```
NodeJs_Logs_Project
│
├── scripts
│   └── eventLoopTest.js
│
├── controllers
├── models
├── routes
│
├── docs
│   └── learning
│       └── day-1-node-event-loop.md
│
├── server.js
└── README.md
```

---

# 📦 Required Packages

No external packages are required.

This experiment only uses **built-in Node.js features**.

---

# 🧠 Key Learnings

1️⃣ Node.js uses an **event loop to handle concurrency**.

2️⃣ Even though Node.js is **single-threaded**, it can handle **thousands of requests concurrently**.

3️⃣ Microtasks (`process.nextTick`, Promises) execute **before the next event loop phase**.

4️⃣ Understanding the event loop helps developers avoid **blocking the server**.

---

# ⚠️ Important Backend Insight

Blocking code like this is dangerous:

```javascript
while(true) {}
```

This blocks the **entire event loop**, meaning:

* no requests can be processed
* server becomes unresponsive

---

# 🚀 Real-World Importance

Understanding the event loop helps when building:

* high-performance APIs
* real-time systems
* scalable backend services

This concept is frequently asked in **Node.js backend interviews**.

---

# 📚 Next Learning Step

Day 2 focuses on **Load Testing the Logging API**, where thousands of requests are sent to observe server behavior under heavy traffic.
