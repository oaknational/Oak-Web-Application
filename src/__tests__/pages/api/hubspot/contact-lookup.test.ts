/**
 * @jest-environment node
 */
import { NextApiRequest, NextApiResponse } from "next";
import { Client as HubspotClient } from "@hubspot/api-client";
import { createMocks } from "node-mocks-http";

// Import the handler without any mocking
import { createHandler } from "src/pages/api/hubspot/contact-lookup/";

describe("/api/hubspot/contact-lookup", () => {
  const hubspot = new HubspotClient();
  const handler = createHandler(hubspot);

  // Mock the HubSpot API methods we'll use
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(hubspot.crm.contacts.basicApi, "getById")
      .mockImplementation(() => {
        throw new Error("This should be mocked in individual tests");
      });
    jest.spyOn(hubspot, "apiRequest").mockImplementation(() => {
      throw new Error("This should be mocked in individual tests");
    });
  });

  describe("API handler", () => {
    test("should return contact when found by email", async () => {
      const mockContact = {
        id: "1",
        properties: {
          email: "test@example.com",
          firstname: "Test",
          lastname: "User",
        },
      };

      // Mock the HubSpot API call directly
      (hubspot.crm.contacts.basicApi.getById as jest.Mock).mockResolvedValue(
        mockContact,
      );

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { email: "test@example.com" },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ contact: mockContact });
      expect(hubspot.crm.contacts.basicApi.getById).toHaveBeenCalledWith(
        "test@example.com",
        undefined,
        undefined,
        undefined,
        false,
        "email",
      );
    });

    test("should return contact when found by cookie", async () => {
      const mockContact = {
        id: "1",
        properties: {
          email: "test@example.com",
          firstname: "Test",
          lastname: "User",
        },
      };

      // Mock the HubSpot API calls directly
      const mockJsonMethod = jest.fn().mockResolvedValue({
        properties: {
          email: {
            value: "test@example.com",
          },
        },
      });

      (hubspot.apiRequest as jest.Mock).mockResolvedValue({
        json: mockJsonMethod,
      });

      (hubspot.crm.contacts.basicApi.getById as jest.Mock).mockResolvedValue(
        mockContact,
      );

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { hubspotutk: "test-cookie-value" },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ contact: mockContact });
      expect(hubspot.apiRequest).toHaveBeenCalledWith({
        method: "get",
        path: "/contacts/v1/contact/utk/test-cookie-value/profile",
      });
    });

    test("should return 400 with invalid request", async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: {}, // Missing both email and hubspotutk
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toEqual({
        error: "Invalid request",
        details: "Request must include either email or hubspotutk",
      });
    });

    test("should return 400 with invalid email", async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { email: "not-an-email" },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData().error).toBe("Invalid request");
    });

    test("should return 405 for non-POST methods", async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "GET",
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(res._getJSONData().error).toBe("Method not allowed");
    });

    test("should return 500 on unexpected errors", async () => {
      console.error = jest.fn();
      (hubspot.crm.contacts.basicApi.getById as jest.Mock).mockRejectedValue(
        new Error("Some error"),
      );

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { email: "test@example.com" },
      });

      await handler(req, res);

      expect(console.error).toHaveBeenCalledWith(
        "Error looking up HubSpot contact:",
        expect.anything(),
      );
      expect(res._getStatusCode()).toBe(500);
      expect(res._getJSONData().error).toBe("Failed to lookup contact");
    });

    test("should return null for 404 errors from HubSpot API", async () => {
      (hubspot.crm.contacts.basicApi.getById as jest.Mock).mockRejectedValue({
        code: 404,
      });

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { email: "nonexistent@example.com" },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ contact: null });
    });
  });
});
