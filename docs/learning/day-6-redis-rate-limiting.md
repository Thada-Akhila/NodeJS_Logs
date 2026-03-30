# 📅 Day 6 – Redis-Based Rate Limiting (Distributed Systems)

## 🎯 Objective

Implement a **production-grade rate limiter** using Redis to handle high traffic in a scalable backend system.

---

# 🧠 Why Move Beyond express-rate-limit?

Previously (Day 5):

* Used `express-rate-limit`
* Works in-memory
* Not scalable ❌

Problems:

* Each server has its own limit
* Does not work in distributed systems
* Resets on server restart

---

# 🚀 Solution: Redis-Based Rate Limiting

Redis allows:

* shared state across multiple servers
* atomic operations
* high performance

---

# ⚙️ Architecture

```
Client Request
      ↓
Redis Rate Limiter Middleware
      ↓
Redis (Counter + Expiry)
      ↓
Allow / Block Request
      ↓
API Controller
```

---

# 🧩 Implementation

## Middleware Code

```javascript
import redisClient from "../configs/redis.js";

export const redisRateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;

    const WINDOW_SIZE = 60; // seconds
    const MAX_REQUESTS = 200;

    const key = `rate_limit:${ip}`;

    const current = await redisClient.get(key);

    if (current && parseInt(current) >= MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: "Too many requests (Redis limiter)"
      });
    }

    await redisClient.incr(key);

    if (!current) {
      await redisClient.expire(key, WINDOW_SIZE);
    }

    next();

  } catch (error) {
    console.error("Rate limiter error:", error);
    next(); // fail open
  }
};
```

---

# 🔑 Key Concepts

## 1. Redis INCR

* Atomically increments value
* Prevents race conditions
* Safe for concurrent requests

---

## 2. Redis EXPIRE

* Sets TTL (time to live)
* Automatically resets counter
* No manual cleanup required

---

## 3. Rate Limit Key Design

```
rate_limit:IP
```

Example:

```
rate_limit:127.0.0.1
```

---

# 🔗 Applying Middleware

```javascript
router.post("/", redisRateLimiter, addLog);
```

---

# 🧪 Load Testing Results

During load test:

* Initial requests → success ✅
* After limit reached → blocked ❌

Console output:

```
❌ Rate limited: Too many requests (Redis limiter)
```

---

# 📊 Observations

* Rate limiter worked correctly
* Requests were controlled at Redis level
* System remained stable under heavy load

---

# ⚠️ Important Insight

Even Redis-based rate limiting:

* still blocks high traffic
* must be tuned properly

---

# 💡 Improvements & Tuning

## Increase limits for internal APIs

```javascript
const MAX_REQUESTS = 1000;
```

---

## Reduce window size

```javascript
const WINDOW_SIZE = 10;
```

---

## Use user-based limiting

```javascript
const key = `rate_limit:user:${userId}`;
```

---

# 🏗 Production-Level Enhancements

Real-world systems use:

* Redis cluster
* API Gateway rate limiting
* Token bucket algorithm
* Sliding window algorithm

---

# 🔥 Comparison

| Feature      | express-rate-limit | Redis Rate Limiter |
| ------------ | ------------------ | ------------------ |
| Storage      | Memory             | Redis              |
| Scalable     | ❌                  | ✅                  |
| Multi-server | ❌                  | ✅                  |
| Persistence  | ❌                  | ✅                  |

---

# 🧠 Key Learnings

* Built distributed rate limiter
* Used Redis atomic operations
* Understood real-world backend scaling
* Observed behavior under high load

---

# 🚀 Conclusion

Redis-based rate limiting is essential for:

* scalable backend systems
* handling high traffic
* preventing abuse

However, it must be **carefully tuned** based on system requirements.

---

# 🎯 Interview Takeaway

"I implemented a Redis-based rate limiter using atomic counters and expiry, which allows consistent rate limiting across distributed systems."
