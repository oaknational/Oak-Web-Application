import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextApiRequest } from "next";

const environment = process.env.NODE_ENV;

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(environment !== "production" ? 5 : 50, "1 d"),
  prefix: "@upstash/ratelimit",
  analytics: true,
});

// Helper function to check rate limit based on IP address
export async function checkRateLimit(
  req: NextApiRequest,
): Promise<{ success: boolean; limit?: number; remaining?: number }> {
  const ip =
    typeof req.headers["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"].split(",")[0]
      : req.socket?.remoteAddress || null;

  if (ip === "::1" || ip === "127.0.0.1") {
    // localhost
    return { success: true, limit: 2, remaining: 2 };
  }
  if (!ip) {
    return { success: false };
  }

  const { success, limit, remaining } = await ratelimit.limit(ip);
  return { success, limit, remaining };
}
