import { createClient, RedisClientType } from "redis";
import app from "../../app.js";

const redis: RedisClientType = await createClient({
  url: `redis://default:${app.config.REDIS_PASSWORD}@${app.config.REDIS_HOST}:${app.config.REDIS_PORT}`
})

redis.on("error", (err) => console.log("Redis Client Error", err));

await redis.connect();

export default redis;