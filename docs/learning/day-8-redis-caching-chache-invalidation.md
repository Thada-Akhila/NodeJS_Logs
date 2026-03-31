# 📅 Day 8 – Redis Caching & Cache Invalidation

## 🚀 What I Built

Today, I implemented **Redis-based caching** in my logging system to improve performance and reduce database load.

---

## 🧠 Concepts Learned

### 1. Cache-Aside Pattern (Lazy Loading)

* First request → Fetch from DB → Store in cache
* Next request → Serve from cache

```js
// Try cache first
const cached = await getCache(cacheKey);
if (cached) return res.json(cached);

// Otherwise fetch from DB
const data = await DB.query();

// Store in cache
await setCache(cacheKey, data);
```

---

### 2. Cache Key Design

```js
const cacheKey = `logs:${page}:${limit}:${search}:${sort}`;
```

✔ Ensures unique cache per query
✔ Prevents incorrect data sharing

---

### 3. Cache Invalidation (Critical Problem)

Problem:

* When new logs are added → cache becomes stale

Solution:

* Track cache keys using Redis SET
* Delete only relevant keys when data changes

---

### 4. Efficient Cache Invalidation (SET-based)

```js
// Track keys
await redisClient.sadd("logs_cache_keys", cacheKey);

// Invalidate cache
const keys = await redisClient.smembers("logs_cache_keys");
await redisClient.del(keys);
await redisClient.del("logs_cache_keys");
```

---

## ❌ What I Avoided

### KEYS command

* Blocks Redis
* Not scalable

### SCAN (for this use case)

* Unnecessary complexity
* SET tracking is faster

---

## ⚡ Performance Improvement

| Scenario            | Without Cache | With Cache |
| ------------------- | ------------- | ---------- |
| First Request       | Slow (DB hit) | Slow       |
| Subsequent Requests | Slow          | Fast ⚡     |

---

## 🏗️ Final Architecture

Client → API → Redis Cache → MongoDB
↓
Redis Queue → Worker → DB

---

## 💬 Interview Explanation

"I implemented Redis caching using the cache-aside pattern. To handle cache invalidation efficiently, I tracked cache keys in a Redis set and removed them when new logs were added, ensuring data consistency without using blocking Redis operations."

---

## 📌 Key Takeaways

* Caching reduces DB load
* Cache invalidation is the hardest problem
* Key design is critical
* Redis data structures (SET, LIST, ZSET) are powerful

---

## 🔥 Next Step

* Cache Stampede problem
* Stale-While-Revalidate
* Advanced caching strategies
