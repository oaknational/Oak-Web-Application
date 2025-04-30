/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

import { POST } from "./route";

const reportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

const mockHeaders = jest.fn().mockReturnValue("header-value");
jest.mock("next/headers", () => ({
  headers: jest.fn().mockReturnValue({
    get: () => mockHeaders(),
  }),
}));

const mockVerify = jest
  .fn()
  .mockReturnValue({ data: { id: "123" }, type: "user.updated" });
jest.mock("svix", () => ({
  Webhook: jest.fn().mockImplementation(() => ({
    verify: () => mockVerify(),
  })),
}));

const mockCreateUser = jest.fn().mockResolvedValue({});
jest.mock("@/node-lib/personalisation-api", () => ({
  getWebhookEducatorApi: jest.fn().mockResolvedValue({
    createUser: () => mockCreateUser(),
  }),
}));

describe("/api/auth/onboarding", () => {
  let req: NextRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    req = new NextRequest("http://example.com", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {},
    });
  });
  test("returns 200 ok", async () => {
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
  test("returns 400 error when headers are missing and reports error", async () => {
    mockHeaders.mockReturnValueOnce(undefined);
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(reportError).toHaveBeenCalledWith(new Error("Missing Svix headers"));
  });
  test("returns 400 error when verification fails and reports the error", async () => {
    const error = new Error("Verification failed");
    mockVerify.mockImplementationOnce(() => {
      throw error;
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(reportError).toHaveBeenCalledWith(error, {
      message: "Could not verify request headers",
    });
  });
  test("returns 500 error when user update fails", async () => {
    mockCreateUser.mockRejectedValueOnce(new Error("Failed to create user"));
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
