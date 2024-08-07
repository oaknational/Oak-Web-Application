/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { generateSessionCookie } from "@auth0/nextjs-auth0/testing";

import { POST } from "./route";

import getServerConfig from "@/node-lib/getServerConfig";
import { userManagementClient } from "@/node-lib/auth/userManagement";
import { auth0 } from "@/node-lib/auth/auth0";

jest.mock("@/node-lib/auth/userManagement");

describe("/api/auth/onboarding", () => {
  it("requires authentication", async () => {
    const req = new NextRequest("http://example.com/api/auth/onboarding", {
      method: "POST",
    });
    const response = await POST(req, {});

    expect(response.status).toBe(401);
  });

  it("marks the user as onboarded", async () => {
    jest.spyOn(auth0, "updateSession");
    const sessionCookie = await generateSessionCookie(
      {
        user: {
          sub: "auth0|1234567890",
        },
      },
      { secret: getServerConfig("auth0Secret") },
    );
    const req = new NextRequest("http://example.com/api/auth/onboarding", {
      method: "POST",
    });
    req.cookies.set("appSession", sessionCookie);

    const response = await POST(req, {});

    expect(userManagementClient.users.update).toHaveBeenCalledWith(
      {
        id: "auth0|1234567890",
      },
      {
        app_metadata: {
          "owa:onboarded": true,
        },
      },
    );
    expect(response.status).toBe(200);

    await expect(response.json()).resolves.toEqual({
      "owa:onboarded": true,
    });
  });
});
