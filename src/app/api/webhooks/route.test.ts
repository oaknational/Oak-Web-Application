/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

import { POST } from "./route";

import { handleSessionCreatedEvent } from "@/utils/handleSessionCreatedEvent";

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
jest.mock("@/node-lib/educator-api", () => ({
  getWebhookEducatorApi: jest.fn().mockResolvedValue({
    createUser: () => mockCreateUser(),
  }),
}));

jest.mock("@/utils/handleSessionCreatedEvent", () => ({
  handleSessionCreatedEvent: jest.fn(),
}));

describe("/api/webhooks", () => {
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

  test("does not call handleSessionCreatedEvent when type of event is user.updated", async () => {
    mockVerify.mockReturnValue({
      data: { id: "123" },
      type: "user.updated",
    });

    await POST(req);

    expect(handleSessionCreatedEvent).not.toHaveBeenCalled();
  });

  test("calls handleSessionCreatedEvent when type of event is session.created", async () => {
    mockVerify.mockReturnValue({
      data: { id: "123" },
      type: "session.created",
    });

    await POST(req);

    expect(handleSessionCreatedEvent).toHaveBeenCalled();
  });

  test("returns 500 error when the event handler throws", async () => {
    mockVerify.mockReturnValue({
      data: { id: "123" },
      type: "session.created",
    });
    jest
      .mocked(handleSessionCreatedEvent)
      .mockRejectedValueOnce(new Error("Error"));
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});
