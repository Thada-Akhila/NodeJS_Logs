# 📅 Day 7 – Sliding Window Rate Limiting (Production Grade)

## 🎯 Objective

Implement an advanced **Sliding Window Rate Limiter** using Redis to achieve accurate and fair request limiting.

---

# 🧠 Problem with Fixed Window

In fixed window systems:

```
0–60 sec → 200 requests allowed
61 sec → reset → again 200 allowed
```

This allows burst traffic:

```
200 requests at 59th second
200 requests at 61st second
```

👉 Total = 400 requests in ~2 seconds ❌

---

# 🚀 Solution: Sliding Window Algorithm

Instead of counting requests per window:

👉 Track **timestamps of each request**

Then:

1. Remove expired requests
2. Count valid requests
3. Allow or block

---

# ⚙️ Architecture

```
Client Request
      ↓
Sliding Window Middleware
      ↓
Redis Sorted Set (ZSET)
      ↓
Filter by timestamp
      ↓
Allow / Block
```

---

# 🧩 Implementation

## Middleware Code

```javascript
import redisClient from "../configs/redis.js";

export const slidingWindowLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;

    const WINDOW_SIZE = 60; // seconds
    const MAX_REQUESTS = 200;

    const key = `rate_limit:${ip}`;
    const now = Date.now();

    // Remove old requests
    await redisClient.zRemRangeByScore(
      key,
      0,
      now - WINDOW_SIZE * 1000
    );

    // Count current requests
    const currentRequests = await redisClient.zCard(key);

    if (currentRequests >= MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: "Too many requests (Sliding Window)"
      });
    }

    // Add current request
    await redisClient.zAdd(key, {
      score: now,
      value: `${now}-${Math.random()}`
    });

    // Set expiry
    await redisClient.expire(key, WINDOW_SIZE);

    next();

  } catch (error) {
    console.error("Sliding window error:", error);
    next();
  }
};
```

---

# 🔑 Key Concepts

## Redis Sorted Set (ZSET)

* Stores request timestamps
* Supports range queries
* Efficient for sliding window logic

---

## zRemRangeByScore

Removes outdated requests:

```
Remove all timestamps older than window
```

---

## zCard

Returns number of valid requests inside window

---

# 🧪 Load Testing Results

```
Sent 1000 logs
Finished sending logs 🚀
```

### Observations

* No excessive blocking
* Smooth request handling
* No burst traffic spikes

---

# 📊 Comparison

| Feature          | Fixed Window | Redis Counter | Sliding Window |
| ---------------- | ------------ | ------------- | -------------- |
| Accuracy         | ❌            | ❌             | ✅              |
| Burst Control    | ❌            | ❌             | ✅              |
| Production Ready | ⚠️           | ✅             | ✅✅             |

---

# 💡 Advantages

* Prevents sudden spikes
* Fair request distribution
* Better user experience
* More accurate limiting

---

# ⚠️ Trade-offs

* Slightly higher Redis usage
* More complex than simple counters

---

# 🧠 Key Learnings

* Understood limitations of fixed window
* Implemented sliding window using Redis
* Used sorted sets for time-based filtering
* Built production-level rate limiter

---

# 🚀 Conclusion

Sliding window rate limiting provides:

* accurate traffic control
* smooth request distribution
* real-world production reliability

---

# 🎯 Interview Takeaway

"I implemented a sliding window rate limiter using Redis sorted sets, which ensures accurate request limiting by tracking timestamps instead of simple counters."
