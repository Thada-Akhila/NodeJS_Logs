import session from "express-session";
import connectRedis from "connect-redis";
import redisClient from "./redis.js";

const RedisStore = connectRedis(session);

export const sessionMiddleware = session({
  store: new RedisStore({
    client: redisClient,
    prefix: "sess:"
  }),
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60
  }
});