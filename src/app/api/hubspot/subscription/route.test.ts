/**
 * @jest-environment node
 */
import {
  PublicSubscriptionStatusesResponse,
  PublicSubscriptionStatusSourceOfStatusEnum,
  PublicSubscriptionStatusStatusEnum,
} from "@hubspot/api-client/lib/codegen/communication_preferences";
import { Client as HubspotClient } from "@hubspot/api-client";

import { createHandler } from "./createHandler";

import {
  mockCurrentUser,
  mockCurrentUserWithNoEmailAddresses,
  setCurrentUser,
} from "@/__tests__/__helpers__/mockClerkServer";

jest.mock("@clerk/nextjs/server");

describe("POST /api/hubspot/subscription", () => {
  const hubspot = new HubspotClient();
  const POST = createHandler(hubspot);
  const subscribedResponse: PublicSubscriptionStatusesResponse = {
    recipient: "",
    subscriptionStatuses: [
      {
        name: "School Support",
        status: PublicSubscriptionStatusStatusEnum.Subscribed,
        description: "",
        id: "1",
        sourceOfStatus:
          PublicSubscriptionStatusSourceOfStatusEnum.SubscriptionStatus,
      },
    ],
  };
  const unsubscribedResponse: PublicSubscriptionStatusesResponse = {
    recipient: "",
    subscriptionStatuses: [
      {
        name: "School Support",
        status: PublicSubscriptionStatusStatusEnum.NotSubscribed,
        description: "",
        id: "1",
        sourceOfStatus:
          PublicSubscriptionStatusSourceOfStatusEnum.SubscriptionStatus,
      },
    ],
  };
  function createRequest(
    body: object = { subscriptionName: "School Support" },
  ) {
    return new Request("http://example.com", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  beforeEach(() => {
    setCurrentUser(mockCurrentUser);
  });

  it("should response true when subscription status is set", async () => {
    jest
      .spyOn(hubspot.communicationPreferences.statusApi, "getEmailStatus")
      .mockResolvedValueOnce(subscribedResponse);

    const res = await POST(createRequest());

    expect(res.status).toBe(200);
    expect(await res.json()).toBe(true);
  });

  it("should respond false when subscription status is not set", async () => {
    jest
      .spyOn(hubspot.communicationPreferences.statusApi, "getEmailStatus")
      .mockResolvedValueOnce(unsubscribedResponse);

    const res = await POST(createRequest());

    expect(res.status).toBe(200);
    expect(await res.json()).toBe(false);
  });

  test("should respond false when the user has no primary email", async () => {
    setCurrentUser(mockCurrentUserWithNoEmailAddresses);

    const res = await POST(createRequest());

    expect(res.status).toBe(200);
    expect(await res.json()).toBe(false);
  });

  test("requires authentication", async () => {
    setCurrentUser(null);

    const res = await POST(createRequest());

    expect(res.status).toBe(401);
  });

  test("validates the request body", async () => {
    const res = await POST(createRequest({}));

    expect(res.status).toBe(400);
  });
});
