import { NextApiRequest } from "next";
import { Ratelimit } from "@upstash/ratelimit";

import { checkRateLimitByIp, createRateLimiter } from "./rateLimiter";

const mockLimit = jest.fn();

jest.mock("@upstash/redis", () => ({
  Redis: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("@vercel/functions", () => ({
  waitUntil: jest.fn(),
}));

jest.mock("@upstash/ratelimit", () => {
  const mockRatelimitClass = jest.fn().mockImplementation(() => ({
    limit: mockLimit,
  })) as jest.Mock & { fixedWindow: jest.Mock };

  mockRatelimitClass.fixedWindow = jest.fn(() => ({}));

  return {
    Ratelimit: mockRatelimitClass,
  };
});

describe("rateLimiter", () => {
  let rateLimiter: Ratelimit;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLimit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: 1234567890,
      pending: Promise.resolve(),
    });

    rateLimiter = createRateLimiter(
      "test:rate-limit",
      Ratelimit.fixedWindow(10, "24h"),
    );
  });

  describe("checkRateLimitByIp", () => {
    describe("IP extraction", () => {
      it("should use cf-connecting-ip header when present", async () => {
        const req = {
          headers: {
            "cf-connecting-ip": "203.0.113.1",
          },
          socket: {
            remoteAddress: "192.168.1.1",
          },
        } as unknown as NextApiRequest;

        await checkRateLimitByIp(rateLimiter, req);

        expect(mockLimit).toHaveBeenCalledWith("203.0.113.1");
      });

      it("should fall back to socket.remoteAddress when cf-connecting-ip is not present", async () => {
        const req = {
          headers: {},
          socket: {
            remoteAddress: "192.168.1.1",
          },
        } as unknown as NextApiRequest;

        await checkRateLimitByIp(rateLimiter, req);

        expect(mockLimit).toHaveBeenCalledWith("192.168.1.1");
      });

      it("should throw error when no IP address is available", async () => {
        const req = {
          headers: {},
          socket: {},
        } as unknown as NextApiRequest;

        await expect(checkRateLimitByIp(rateLimiter, req)).rejects.toThrow(
          "IP address is required for rate limiting",
        );
      });

      it("should handle IPv6 localhost", async () => {
        const req = {
          headers: {},
          socket: {
            remoteAddress: "::1",
          },
        } as unknown as NextApiRequest;

        await checkRateLimitByIp(rateLimiter, req);

        expect(mockLimit).toHaveBeenCalledWith("::1");
      });
    });

    describe("rate limit checking", () => {
      it("should return success response when rate limit not exceeded", async () => {
        mockLimit.mockResolvedValue({
          success: true,
          limit: 100,
          remaining: 99,
          reset: 1234567890,
          pending: Promise.resolve(),
        });

        const req = {
          headers: { "cf-connecting-ip": "203.0.113.1" },
          socket: {},
        } as unknown as NextApiRequest;

        const result = await checkRateLimitByIp(rateLimiter, req);

        expect(result).toEqual({
          success: true,
          limit: 100,
          remaining: 99,
          reset: 1234567890,
        });
      });

      it("should return failure response when rate limit exceeded", async () => {
        mockLimit.mockResolvedValue({
          success: false,
          limit: 100,
          remaining: 0,
          reset: 1234567890,
          pending: Promise.resolve(),
        });

        const req = {
          headers: { "cf-connecting-ip": "203.0.113.1" },
          socket: {},
        } as unknown as NextApiRequest;

        const result = await checkRateLimitByIp(rateLimiter, req);

        expect(result).toEqual({
          success: false,
          limit: 100,
          remaining: 0,
          reset: 1234567890,
        });
      });

      it("should not include pending in returned response", async () => {
        mockLimit.mockResolvedValue({
          success: true,
          limit: 100,
          remaining: 99,
          reset: 1234567890,
          pending: Promise.resolve(),
        });

        const req = {
          headers: { "cf-connecting-ip": "203.0.113.1" },
          socket: {},
        } as unknown as NextApiRequest;

        const result = await checkRateLimitByIp(rateLimiter, req);

        expect(result).not.toHaveProperty("pending");
      });
    });
  });
});
