import { NextApiRequest, NextApiResponse } from "next";
import { Client as HubspotClient } from "@hubspot/api-client";
import { createMocks } from "node-mocks-http";

import handler from ".";

const getById = jest.fn();
const error = new Error("Not found");

jest.mock(
  "@hubspot/api-client/lib/codegen/crm/contacts/types/PromiseAPI",
  () => {
    return {
      ...jest.requireActual(
        "@hubspot/api-client/lib/codegen/crm/contacts/types/PromiseAPI",
      ),
      PromiseBasicApi: jest.fn().mockImplementation(() => {
        return {
          getById: getById,
        };
      }),
    };
  },
);

describe("Handler API", () => {
  const hubspot = new HubspotClient();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history between tests
  });

  test("should return 200 with valid contact data", async () => {
    (hubspot.crm.contacts.basicApi.getById as jest.Mock).mockResolvedValueOnce({
      properties: {
        email: "test@email.com",
        contact_school_name: "Test School",
        contact_school_urn: "123456",
      },
    });

    // Mock req and res objects
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        email: "test@email.com",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      email: "test@email.com",
      schoolName: "Test School",
      schoolId: "123456",
    });

    // Ensure the mocked API function was called with the correct params
    expect(hubspot.crm.contacts.basicApi.getById).toHaveBeenCalledWith(
      "test@email.com", // contactId
      ["contact_school_name", "contact_school_urn"], // properties
      undefined, // propertiesWithHistory
      undefined, // associations
      false, // archived
      "email", // idProperty
    );
  });

  test("should return 204 when contact is not found", async () => {
    // Mock the getById response to throw a 404 error
    console.log("error", error);
    (hubspot.crm.contacts.basicApi.getById as jest.Mock).mockRejectedValueOnce(
      Object.assign(new Error("Not Found"), { code: 404 }),
    );

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        email: "notfound@email.com",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(204);
  });

  test("should return 500 when an unknown error occurs", async () => {
    (hubspot.crm.contacts.basicApi.getById as jest.Mock).mockRejectedValue(
      new Error("Unknown error"),
    );

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        email: "error@email.com",
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: JSON.stringify(new Error("Unknown error")),
    });
  });
});
