import { SessionWebhookEvent, User } from "@clerk/nextjs/server";

import { handleSessionCreatedEvent } from "./handleSessionCreatedEvent";

import {
  installMockClerkClient,
  mockServerUser,
} from "@/__tests__/__helpers__/mockClerkServer";

jest.mock("@clerk/nextjs/server");

const updateUserMetadata = jest.fn();
const getUser = jest.fn();
const updateUser = jest.fn();

const sessionEvent: SessionWebhookEvent = {
  data: {
    user_id: "user_123",
  },
} as SessionWebhookEvent;

describe("handleSessionCreatedEvent", () => {
  installMockClerkClient({
    updateUserMetadata,
    updateUser,
    getUser,
    mockUser: mockServerUser,
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should update user metadata when user is created within target date range", async () => {
    const targetUser: User = {
      id: "user_123",
      createdAt: new Date("2025-07-25").getTime(), // Within range
    } as User;

    getUser.mockResolvedValue(targetUser);
    updateUser.mockResolvedValue({});

    await handleSessionCreatedEvent(sessionEvent);

    expect(getUser).toHaveBeenCalledWith("user_123");
    expect(updateUser).toHaveBeenCalledWith("user_123", {
      unsafeMetadata: { requiresGeoLocation: true },
    });
  });

  test("should not update user metadata when user is created before target date range", async () => {
    const userBeforeRange: User = {
      id: "user_123",
      createdAt: new Date("2025-07-20").getTime(), // Before range
    } as User;

    getUser.mockResolvedValue(userBeforeRange);

    await handleSessionCreatedEvent(sessionEvent);

    expect(getUser).toHaveBeenCalledWith("user_123");
    expect(updateUser).not.toHaveBeenCalled();
  });

  test("should not update user metadata when user is created after target date range", async () => {
    const userAfterRange: User = {
      id: "user_123",
      createdAt: new Date("2025-08-07").getTime(), // After range
    } as User;

    getUser.mockResolvedValue(userAfterRange);

    await handleSessionCreatedEvent(sessionEvent);

    expect(getUser).toHaveBeenCalledWith("user_123");
    expect(updateUser).not.toHaveBeenCalled();
  });

  test("should update user metadata when user is created on start date boundary", async () => {
    const userOnStartDate: User = {
      id: "user_123",
      createdAt: new Date("2025-07-21").getTime(), // Exactly on start date
    } as User;

    getUser.mockResolvedValue(userOnStartDate);
    updateUser.mockResolvedValue({});

    await handleSessionCreatedEvent(sessionEvent);

    expect(getUser).toHaveBeenCalledWith("user_123");
    expect(updateUser).toHaveBeenCalledWith("user_123", {
      unsafeMetadata: { requiresGeoLocation: true },
    });
  });

  test("should update user metadata when user is created on end date boundary", async () => {
    const userOnEndDate: User = {
      id: "user_123",
      createdAt: new Date("2025-08-06").getTime(), // Exactly on end date
    } as User;

    getUser.mockResolvedValue(userOnEndDate);
    updateUser.mockResolvedValue({});

    await handleSessionCreatedEvent(sessionEvent);

    expect(getUser).toHaveBeenCalledWith("user_123");
    expect(updateUser).toHaveBeenCalledWith("user_123", {
      unsafeMetadata: { requiresGeoLocation: true },
    });
  });
});
