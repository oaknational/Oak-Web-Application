/**
 * @jest-environment node
 */
import { NextApiRequest, NextApiResponse } from "next";
import { Client as HubspotClient } from "@hubspot/api-client";
import { createMocks } from "node-mocks-http";

import { createHandler } from ".";

import {
  installMockClerkClient,
  mockGetAuthSignedIn,
  mockGetAuthSignedOut,
  setGetAuth,
  mockServerUser,
  mockServerUserWithNoEmailAddresses,
} from "@/__tests__/__helpers__/mockClerkServer";

jest.mock("@clerk/nextjs/server");
const updateUserMetadata = jest.fn();
const getUser = jest.fn();

describe("/api/hubspot/contacts", () => {
  const hubspot = new HubspotClient();
  const handler = createHandler(hubspot);

  installMockClerkClient({
    updateUserMetadata,
    getUser,
    mockUser: mockServerUser,
  });

  beforeEach(() => {
    setGetAuth(mockGetAuthSignedIn);
  });

  test("should return 200 with valid contact data", async () => {
    // eslint-disable-next-line
    // @ts-ignore
    jest.spyOn(hubspot.crm.contacts.basicApi, "getById").mockResolvedValueOnce({
      properties: {
        email: "test@email.com",
        contact_school_name: "Test School",
        contact_school_urn: "123456",
      },
    });

    // Mock req and res objects
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      email: "test@email.com",
      schoolName: "Test School",
      schoolId: "123456",
    });

    expect(hubspot.crm.contacts.basicApi.getById).toHaveBeenCalledWith(
      "test@email.com", // contactId
      ["contact_school_name", "contact_school_urn"], // properties
      undefined, // propertiesWithHistory
      undefined, // associations
      false, // archived
      "email", // idProperty
    );
  });

  test("requires authorization", async () => {
    setGetAuth(mockGetAuthSignedOut);
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
  });

  test("sends a 204 when the user has no email addresses", async () => {
    installMockClerkClient({
      updateUserMetadata,
      getUser,
      mockUser: mockServerUserWithNoEmailAddresses,
    });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(204);
  });
});
