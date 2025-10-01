/**
 * @jest-environment node
 */
import {
  PublicSubscriptionStatusSourceOfStatusEnum,
  PublicSubscriptionStatusStatusEnum,
} from "@hubspot/api-client/lib/codegen/communication_preferences";
import { Client as HubspotClient } from "@hubspot/api-client";
import { createMocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next";

import { createHandler } from "src/pages/api/hubspot/subscription/";
import {
  installMockClerkClient,
  mockGetAuthSignedIn,
  mockGetAuthSignedOut,
  mockServerUser,
  mockServerUserWithNoEmailAddresses,
  setGetAuth,
} from "@/__tests__/__helpers__/mockClerkServer";

describe("/api/hubspot/subscription", () => {
  const hubspot = new HubspotClient();
  const handler = createHandler(hubspot);
  installMockClerkClient({
    updateUserMetadata: jest.fn(),
    getUser: jest.fn(),
    mockUser: mockServerUser,
  });

  beforeEach(() => {
    setGetAuth(mockGetAuthSignedIn);
  });

  it("should return true when subscription status is set", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { subscriptionName: "School Support" },
    });

    jest
      .spyOn(hubspot.communicationPreferences.statusApi, "getEmailStatus")
      .mockResolvedValueOnce({
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
      });

    await handler(req, res);

    expect(
      hubspot.communicationPreferences.statusApi.getEmailStatus,
    ).toHaveBeenCalledWith("test@email.com");
    expect(res._getJSONData()).toBe(true);
  });

  it("should return false when subscription status is not set", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { subscriptionName: "School Support" },
    });
    jest
      .spyOn(hubspot.communicationPreferences.statusApi, "getEmailStatus")
      .mockResolvedValueOnce({
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
      });

    await handler(req, res);

    expect(res._getJSONData()).toBe(false);
  });

  test("requires authorization", async () => {
    setGetAuth(mockGetAuthSignedOut);
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
  });

  test("responds false when the user has no email addresses", async () => {
    installMockClerkClient({
      updateUserMetadata: jest.fn(),
      getUser: jest.fn(),
      mockUser: mockServerUserWithNoEmailAddresses,
    });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getJSONData()).toBe(false);
  });
});
