import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextApiRequest } from "next";
import { waitUntil } from "@vercel/functions";

import { invariant } from "../invariant";

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
  // cf-connecting-ip is safer than x-forwarded-for which can be spooked
  const cfIp = req.headers["cf-connecting-ip"];
  if (cfIp) {
    invariant(typeof cfIp === "string", "cf-connecting-ip must be a string");
    return cfIp;
  }
  if (req.socket.remoteAddress) {
    return req.socket.remoteAddress;
  }
  throw new Error("IP address is required for rate limiting");
}

export async function checkRateLimitByIp(
  rateLimiter: Ratelimit,
  req: NextApiRequest,
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const ipAddress = getIpFromRequest(req);
  const { pending, ...rateLimitResult } = await rateLimiter.limit(ipAddress);

  // https://upstash.com/docs/redis/sdks/ratelimit-ts/gettingstarted#serverless-environments
  waitUntil(pending);

  return rateLimitResult;
}
