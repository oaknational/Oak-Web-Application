/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

import { POST } from "./route";

import { handleSessionCreatedEvent } from "@/utils/handleSessionCreatedEvent";
import {
  userSignIn,
  userSignOut,
  userSignUpCompleted,
} from "@/node-lib/avo/Avo";
import { pickSingleSignOnService } from "@/utils/pickSingleSignOnService";

const mockReportError = jest.fn();
const mockGetHeader = jest.fn().mockReturnValue("header-value");
const mockSvixVerify = jest
  .fn()
  .mockReturnValue({ data: { id: "123" }, type: "user.updated" });
const mockEducatorApiCreateUser = jest.fn().mockResolvedValue({});
const mockGetWebhookEducatorApi = jest.fn().mockResolvedValue({
  createUser: () => mockEducatorApiCreateUser(),
});

jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      mockReportError(...args),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn().mockReturnValue({
    get: () => mockGetHeader(),
  }),
}));

jest.mock("svix", () => ({
  Webhook: jest.fn().mockImplementation(() => ({
    verify: () => mockSvixVerify(),
  })),
}));

jest.mock("@/node-lib/educator-api", () => ({
  getWebhookEducatorApi: () => mockGetWebhookEducatorApi(),
}));

jest.mock("@/utils/handleSessionCreatedEvent", () => ({
  handleSessionCreatedEvent: jest.fn(),
}));

jest.mock("@/node-lib/avo/Avo", () => ({
  userSignIn: jest.fn(),
  userSignOut: jest.fn(),
  userSignUpCompleted: jest.fn(),
  initAvo: jest.fn(),
}));

jest.mock("@/utils/pickSingleSignOnService", () => ({
  pickSingleSignOnService: jest.fn().mockReturnValue("google"),
}));

const mockHandleSessionCreatedEvent = jest.mocked(handleSessionCreatedEvent);
const mockUserSignIn = jest.mocked(userSignIn);
const mockUserSignOut = jest.mocked(userSignOut);
const mockUserSignUpCompleted = jest.mocked(userSignUpCompleted);
const mockPickSingleSignOnService = jest.mocked(pickSingleSignOnService);

describe("/api/webhooks", () => {
  let req: NextRequest;
  beforeEach(() => {
    jest.restoreAllMocks();
    mockUserSignIn.mockClear();
    mockUserSignOut.mockClear();
    mockUserSignUpCompleted.mockClear();
    mockPickSingleSignOnService.mockReturnValue("Google");
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
    mockGetHeader.mockReturnValueOnce(undefined);
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(mockReportError).toHaveBeenCalledWith(
      new Error("Missing Svix headers"),
    );
  });
  test("returns 400 error when verification fails and reports the error", async () => {
    const error = new Error("Verification failed");
    mockSvixVerify.mockImplementationOnce(() => {
      throw error;
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(mockReportError).toHaveBeenCalledWith(error, {
      message: "Could not verify request headers",
    });
  });
  test("returns 500 error when user update fails", async () => {
    mockEducatorApiCreateUser.mockRejectedValueOnce(
      new Error("Failed to create user"),
    );
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  test("does not call handleSessionCreatedEvent when type of event is user.updated", async () => {
    mockSvixVerify.mockReturnValue({
      data: { id: "123" },
      type: "user.updated",
    });

    await POST(req);

    expect(mockHandleSessionCreatedEvent).not.toHaveBeenCalled();
  });

  test("calls handleSessionCreatedEvent when type of event is session.created", async () => {
    mockSvixVerify.mockReturnValue({
      data: { id: "123" },
      type: "session.created",
    });

    await POST(req);

    expect(mockHandleSessionCreatedEvent).toHaveBeenCalled();
  });

  test("returns 500 error when the event handler throws", async () => {
    mockSvixVerify.mockReturnValue({
      data: { id: "123" },
      type: "session.created",
    });
    mockHandleSessionCreatedEvent.mockRejectedValueOnce(new Error("Error"));
    const res = await POST(req);

    expect(res.status).toBe(500);
  });

  test("calls userSignIn when session.created event is triggered", async () => {
    mockSvixVerify.mockReturnValue({
      data: { id: "123", user_id: "user-456" },
      type: "session.created",
    });

    await POST(req);

    expect(mockUserSignIn).toHaveBeenCalledWith({
      userId_: "user-456",
    });
  });

  test("calls userSignOut when session.ended event is triggered", async () => {
    mockSvixVerify.mockReturnValue({
      data: { id: "123", user_id: "user-456" },
      type: "session.ended",
    });

    await POST(req);

    expect(mockUserSignOut).toHaveBeenCalledWith({
      userId_: "user-456",
    });
  });

  test("calls userSignOut when session.removed event is triggered", async () => {
    mockSvixVerify.mockReturnValue({
      data: { id: "123", user_id: "user-456" },
      type: "session.removed",
    });

    await POST(req);

    expect(mockUserSignOut).toHaveBeenCalledWith({
      userId_: "user-456",
    });
  });

  test("calls userSignOut when session.revoked event is triggered", async () => {
    mockSvixVerify.mockReturnValue({
      data: { id: "123", user_id: "user-456" },
      type: "session.revoked",
    });

    await POST(req);

    expect(mockUserSignOut).toHaveBeenCalledWith({
      userId_: "user-456",
    });
  });

  test("calls userSignUpCompleted when user.created event is triggered", async () => {
    mockSvixVerify.mockReturnValue({
      data: {
        id: "user-123",
        external_accounts: [{ provider: "google" }, { provider: "microsoft" }],
      },
      type: "user.created",
    });

    await POST(req);

    expect(mockUserSignUpCompleted).toHaveBeenCalledWith({
      platform: "owa",
      product: "user account management",
      engagementIntent: "explore",
      componentType: "signup_form",
      eventVersion: "2.0.0",
      analyticsUseCase: null,
      singleSignOnService: "Google",
      userId_: "user-123",
    });
  });

  test("does not call analytics functions for unknown event types", async () => {
    mockSvixVerify.mockReturnValue({
      data: { id: "123", user_id: "user-456" },
      type: "unknown.event",
    });

    await POST(req);

    expect(mockUserSignIn).not.toHaveBeenCalled();
    expect(mockUserSignOut).not.toHaveBeenCalled();
    expect(mockUserSignUpCompleted).not.toHaveBeenCalled();
  });

  test("continues execution if userSignUpCompleted throws an error", async () => {
    mockSvixVerify.mockReturnValue({
      data: {
        id: "user-123",
        external_accounts: [],
      },
      type: "user.created",
    });
    mockUserSignUpCompleted.mockImplementationOnce(() => {
      throw new Error("Analytics error");
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockReportError).toHaveBeenCalledWith(expect.any(Error), {
      message: "Failed to track user sign-up event",
    });
  });
});
