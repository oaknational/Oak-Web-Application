import { NextApiRequest, NextApiResponse } from "next";
import { Client as HubspotClient } from "@hubspot/api-client";
import { createMocks } from "node-mocks-http";

import handler, { createHandler } from ".";

const getById = jest.fn();

jest.mock("@hubspot/api-client", () => {
  class Client {
    crm = {
      contacts: {
        basicApi: {
          getById: jest.fn().mockImplementation((...args) => getById(...args)),
        },
      },
    };
  }

  return {
    Client,
  };
});

describe("Handler API", () => {
  const hubspot = new HubspotClient();

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history between tests
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
    const handler = createHandler(hubspot);

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

    expect(hubspot.crm.contacts.basicApi.getById).toHaveBeenCalledWith(
      "test@email.com", // contactId
      ["contact_school_name", "contact_school_urn"], // properties
      undefined, // propertiesWithHistory
      undefined, // associations
      false, // archived
      "email", // idProperty
    );
  });

  test("should return 500 when an unknown error occurs", async () => {
    // eslint-disable-next-line
    // @ts-ignore
    jest
      .spyOn(hubspot.crm.contacts.basicApi, "getById")
      .mockRejectedValue(new Error("Unknown error"));

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
