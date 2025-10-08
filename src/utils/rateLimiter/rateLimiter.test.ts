// import { Redis } from "@upstash/redis";
import { NextApiRequest } from "next";
import { Ratelimit } from "@upstash/ratelimit";

import { checkRateLimitByIp, createRateLimiter } from "./rateLimiter";

// const mockRateLimit = jest.fn();
// jest.mock("@upstash/ratelimit", () => ({
//   // ...jest.requireActual("@upstash/ratelimit"),
//   Ratelimit: jest.fn().mockImplementation(() => ({
//     limit: jest.fn(),
//   })),
// }));

jest.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: jest.fn(),
  },
}));

const rateLimiter = createRateLimiter(
  "test:rate-limit",
  Ratelimit.fixedWindow(10, "24h"),
);

describe("checkRateLimitByIp", () => {
  // let mockRateLimit: Ratelimit;
  // let mockFixedWindow = jest.fn();

  // beforeEach(() => {
  //   // Ratelimit.fixedWindow = mockFixedWindow;
  //   mockRateLimit = new Ratelimit({
  //     redis: Redis.fromEnv(),
  //     limiter: mockFixedWindow,
  //     prefix: "",
  //     analytics: false,
  //   }) as unknown as Ratelimit;
  // });

  // it.skip("should return success for an ip address", async () => {
  //   const req = {
  //     headers: {},
  //     socket: {
  //       remoteAddress: "123.0.0.1",
  //     },
  //   } as unknown as NextApiRequest;

  //   const result = await checkRateLimit(req);
  //   expect(result).toEqual({ success: true, limit: 5, remaining: 4 });
  // });

  it.skip("should return success for localhost", async () => {
    const req = {
      headers: {},
      socket: {
        remoteAddress: "::1",
      },
    } as unknown as NextApiRequest;

    const result = await checkRateLimitByIp(rateLimiter, req);
    expect(result).toEqual({ success: true, limit: 2, remaining: 2 });
  });

  it.skip("should return failure for unknown IP", async () => {
    const req = {
      headers: {},
      socket: {
        remoteAddress: null,
      },
    } as unknown as NextApiRequest;

    const result = await checkRateLimitByIp(rateLimiter, req);
    expect(result).toEqual({ success: false });
  });

  //   it.skip("should use x-forwarded-for header if present", async () => {
  //     // Mock ratelimit.limit to return a fixed response
  //     (Ratelimit.prototype.limit as jest.Mock).mockResolvedValue({
  //       success: true,
  //       limit: 50,
  //       remaining: 49,
  //     });

  //     const req = {
  //       headers: {
  //         "x-forwarded-for": "8.8.8.8, 1.2.3.4",
  //       },
  //       socket: {
  //         remoteAddress: "123.0.0.1",
  //       },
  //     } as unknown as NextApiRequest;

  //     const result = await checkRateLimitByIp(req);
  //     expect(Ratelimit.prototype.limit).toHaveBeenCalledWith("8.8.8.8");
  //     expect(result).toEqual({ success: true, limit: 50, remaining: 49 });
  //   });

  //   it.skip("should handle ratelimit.limit returning failure", async () => {
  //     (Ratelimit.prototype.limit as jest.Mock).mockResolvedValue({
  //       success: false,
  //       limit: 50,
  //       remaining: 0,
  //     });

  //     const req = {
  //       headers: {},
  //       socket: {
  //         remoteAddress: "9.9.9.9",
  //       },
  //     } as unknown as NextApiRequest;

  //     const result = await checkRateLimitByIp(req);
  //     expect(result).toEqual({ success: false, limit: 50, remaining: 0 });
  //   });
});
