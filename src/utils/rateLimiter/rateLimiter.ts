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
      url: getServerConfig("aiSearchKvUrl"),
      token: getServerConfig("aiSearchKvToken"),
    }),
    limiter: algorithm,
    prefix,
  });
}

function getIpFromRequest(req: NextApiRequest): string {
  // cf-connecting-ip is the IP of the browser making the initial request to cloudflare
  // This is safer than x-forwarded-for which can be spoofed, and is disabled by default in vercel
  const cfIp = req.headers["cf-connecting-ip"];
  if (cfIp) {
    invariant(typeof cfIp === "string", "cf-connecting-ip must be a string");
    return cfIp;
  }
  const directIp = req.socket.remoteAddress;
  // If cloudflare isn't in the request chain (eg: development), use the direct IP address
  if (directIp) {
    return directIp;
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
