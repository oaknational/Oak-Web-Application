/**
 * @jest-environment node
 */
import { Client as HubspotClient } from "@hubspot/api-client";

import { createHandler } from "./createHandler";

import {
  setCurrentUser,
  mockCurrentUser,
  mockCurrentUserWithNoEmailAddresses,
} from "@/__tests__/__helpers__/mockClerkServer";

const getById = jest.fn();

jest.mock("@clerk/nextjs/server");

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

describe("GET /api/hubspot/contacts", () => {
  const hubspot = new HubspotClient();
  const GET = createHandler(hubspot);

  beforeEach(() => {
    setCurrentUser(mockCurrentUser);
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

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
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

  test("should rethrow when an unknown error occurs", async () => {
    jest
      .spyOn(hubspot.crm.contacts.basicApi, "getById")
      .mockRejectedValue(new Error("Whoops"));

    expect(GET()).rejects.toEqual(new Error("Whoops"));
  });

  test("should respond with 204 when the signed in user has no primary email", async () => {
    setCurrentUser(mockCurrentUserWithNoEmailAddresses);

    const res = await GET();

    expect(res.status).toBe(204);
  });

  test("requires authentication", async () => {
    setCurrentUser(null);

    const res = await GET();

    expect(res.status).toBe(401);
  });
});
