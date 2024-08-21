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
  beforeEach(() => {
    authReturn = { userId: "123" };
  });

  it("requires authentication", async () => {
    authReturn = { userId: null };
    const response = await POST();

    expect(response.status).toBe(401);
  });

  it("marks the user as onboarded", async () => {
    const response = await POST();

    expect(clerkClient().users.updateUserMetadata).toHaveBeenCalledWith("123", {
      publicMetadata: {
        "owa:onboarded": true,
      },
    });
    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual({
      "owa:onboarded": true,
    });
  });
});
