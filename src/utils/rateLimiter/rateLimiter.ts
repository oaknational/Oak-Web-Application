import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextApiRequest } from "next";
import { waitUntil } from "@vercel/functions";

import getServerConfig from "@/node-lib/getServerConfig";

export function createRateLimiter(
  prefix: string,
  algorithm: Ratelimit["limiter"],
) {
  return new Ratelimit({
    redis: new Redis({
      url: getServerConfig("upstashRedisUrl"),
      token: getServerConfig("upstashRedisToken"),
    }),
    limiter: algorithm,
    prefix,
  });
}

function getIpFromRequest(req: NextApiRequest): string {
  // NOTE: Using x-forwarded-for isn't supported by default on vercel as it can be spoofed if not using a proxy like cloudflare
  // https://vercel.com/docs/headers/request-headers#x-forwarded-for
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string") {
    const firstForwardedFor = forwardedFor.split(",")[0];
    if (firstForwardedFor) {
      return firstForwardedFor;
    }
  }
  if (req.socket.remoteAddress) {
    return req.socket.remoteAddress;
  }
  throw new Error("IP address is required for rate limiting");
}

export async function checkRateLimitByIp(
  rateLimiter: Ratelimit,
  req: NextApiRequest,
): Promise<{ success: boolean; limit: number; remaining: number }> {
  const ipAddress = getIpFromRequest(req);
  const { success, limit, remaining, pending } =
    await rateLimiter.limit(ipAddress);

  // https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted#serverless-environments
  waitUntil(pending);

  return { success, limit, remaining };
}
