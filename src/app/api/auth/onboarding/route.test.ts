/**
 * @jest-environment node
 */
import { auth, clerkClient } from "@clerk/nextjs/server";

import { POST } from "./route";

let authReturn: Partial<ReturnType<typeof auth>>;

jest.mock("@clerk/nextjs/server", () => {
  const updateUserMetadataSpy = jest.fn();

  return {
    clerkClient() {
      return {
        users: {
          updateUserMetadata: updateUserMetadataSpy,
        },
      };
    },
    auth() {
      return authReturn;
    },
  };
});

describe("/api/auth/onboarding", () => {
  const req = new Request("http://example.com", {
    method: "POST",
    body: JSON.stringify({ "owa:isTeacher": true }),
  });

  beforeEach(() => {
    authReturn = { userId: "123" };
  });

  it("requires authentication", async () => {
    authReturn = { userId: null };
    const response = await POST(req);

    expect(response.status).toBe(401);
  });

  it("marks the user as onboarded", async () => {
    const response = await POST(req);

    expect(clerkClient().users.updateUserMetadata).toHaveBeenCalledWith("123", {
      publicMetadata: {
        "owa:isTeacher": true,
        "owa:onboarded": true,
      },
    });
    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual({
      "owa:isTeacher": true,
      "owa:onboarded": true,
    });
  });

  it("handles validation errors", async () => {
    const response = await POST(
      new Request("http://example.com", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    );

    expect(response.status).toBe(400);
  });
});
