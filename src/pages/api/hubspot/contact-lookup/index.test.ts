/**
 * @jest-environment node
 */
import { NextApiRequest, NextApiResponse } from "next";
import { Client as HubspotClient } from "@hubspot/api-client";
import { createMocks } from "node-mocks-http";

import { createHandler } from ".";

describe("/api/hubspot/contact-lookup", () => {
  const hubspot = new HubspotClient();
  const handler = createHandler(hubspot);

  // Mock the implementation of the exported functions to avoid complex type issues
  jest.mock(".", () => {
    const originalModule = jest.requireActual(".");
    return {
      ...originalModule,
      getHubspotContactByEmail: jest.fn(),
      getHubspotContactByCookie: jest.fn(),
    };
  });

  // Import the mocked functions
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getHubspotContactByEmail, getHubspotContactByCookie } = require(".");

  beforeEach(() => {
    jest.clearAllMocks();
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

      // Instead of mocking HubSpot methods directly, we mock our wrapper functions
      getHubspotContactByEmail.mockResolvedValueOnce(mockContact);

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { email: "test@example.com" },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ contact: mockContact });
      expect(getHubspotContactByEmail).toHaveBeenCalledWith(
        hubspot,
        "test@example.com",
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

      // Instead of mocking HubSpot methods directly, we mock our wrapper functions
      getHubspotContactByCookie.mockResolvedValueOnce(mockContact);

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { hubspotutk: "test-cookie-value" },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({ contact: mockContact });
      expect(getHubspotContactByCookie).toHaveBeenCalledWith(
        hubspot,
        "test-cookie-value",
      );
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
      getHubspotContactByEmail.mockRejectedValueOnce(new Error("Some error"));

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { email: "test@example.com" },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(res._getJSONData().error).toBe("Failed to lookup contact");
    });
  });
});
