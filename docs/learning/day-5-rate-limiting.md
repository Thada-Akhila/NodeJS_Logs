# 📅 Day 5 – Rate Limiting in Backend Systems

## 🎯 What is Rate Limiting?

Rate limiting is a technique used to **control how many requests a client can make** to a server within a specific time window.

It helps prevent:

* server overload
* abuse or spam requests
* denial-of-service (DoS) attacks

---

## 🧠 Real-World Example

Imagine:

* A user sends **10,000 requests instantly**
* Without rate limiting → server may crash
* With rate limiting → requests are restricted

Example:

```
Limit: 100 requests per 15 minutes per IP
```

---

## ⚙️ Implementation in This Project

We used:

```
express-rate-limit
```

### Rate Limiter Configuration

```javascript
import rateLimit from "express-rate-limit";

export const logRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  message: {
    success: false,
    message: "Too many requests, please try again later"
  },

  standardHeaders: true,
  legacyHeaders: false
});
```

---

## 🔗 Applying Rate Limiter

```javascript
import { logRateLimiter } from "../middlewares/rateLimiter.js";

router.post("/", logRateLimiter, addLog);
```

---

## 🧪 Load Testing Observation

When running load test:

* First ~100 requests → success ✅
* Remaining requests → blocked ❌

Console output:

```
❌ Rate limited: Too many requests, please try again later
```

---

## 📊 Why This Happens

Because:

```
max = 100 requests
window = 15 minutes
```

After limit is reached:

→ Server rejects further requests

---

## ⚠️ Problem in Current Setup

During load testing:

* Too many requests get blocked
* Not ideal for internal systems like logging

---

## 💡 Solution Strategy

We should:

### 1. Relax limits for internal APIs

Example:

```javascript
max: 10000
windowMs: 1 * 60 * 1000
```

---

### 2. Apply rate limiting selectively

Instead of:

```
Apply to ALL users
```

Do:

* Strict limits → public APIs
* Relaxed limits → internal services

---

### 3. Use Redis-based rate limiting (Advanced)

Why?

* Works across multiple servers
* Scalable
* Distributed system support

---

## 🏗 Production Approach

Real systems use:

* API Gateway rate limiting
* Redis-based counters
* Token bucket / sliding window algorithms

---

## 🧠 Key Learnings

* Rate limiting protects backend systems
* It controls traffic spikes
* It prevents abuse
* Needs proper tuning based on use case

---

## 🚀 Conclusion

Rate limiting is essential for:

* system stability
* security
* performance control

But must be configured carefully to avoid blocking legitimate traffic.
