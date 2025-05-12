import { renderHook, act } from "@testing-library/react";

import getHubspotUserToken from "../forms/getHubspotUserToken";

import { useHubspotCookieContactLookup } from "./useHubspotCookieContactLookup";

// Mock dependencies
jest.mock("../forms/getHubspotUserToken");
const mockGetHubspotUserToken = getHubspotUserToken as jest.MockedFunction<
  typeof getHubspotUserToken
>;

// Mock fetch
const originalFetch = global.fetch;
let mockFetch: jest.Mock;

describe("useHubspotCookieContactLookup", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset fetch mock
    mockFetch = jest.fn();
    global.fetch = mockFetch;

    // Silence console logs
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  test("should return initial state correctly", () => {
    mockGetHubspotUserToken.mockReturnValue(undefined);

    const { result } = renderHook(() => useHubspotCookieContactLookup());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.contactData).toBeNull();
    expect(typeof result.current.lookupContactByCookie).toBe("function");
  });

  test("should call lookupContactByCookie on mount", () => {
    mockGetHubspotUserToken.mockReturnValue("mock-cookie-value");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ contact: null }),
    });

    renderHook(() => useHubspotCookieContactLookup());

    // Check that fetch was called with the correct arguments
    expect(mockFetch).toHaveBeenCalledWith("/api/hubspot/contact-lookup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hubspotutk: "mock-cookie-value" }),
    });
  });

  test("should handle case when no hubspot cookie is found", async () => {
    mockGetHubspotUserToken.mockReturnValue(undefined);

    const { result } = renderHook(() => useHubspotCookieContactLookup());

    // Manually call the function to test return value
    let returnValue;
    await act(async () => {
      returnValue = await result.current.lookupContactByCookie();
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(returnValue).toBeNull();
    expect(console.info).toHaveBeenCalledWith(
      "No HubSpot cookie found, user likely has not interacted with HubSpot",
    );
  });

  test("should set contact data on successful fetch", async () => {
    const mockContact = {
      id: "123",
      properties: {
        email: "test@example.com",
        firstname: "Test",
        lastname: "User",
      },
    };

    mockGetHubspotUserToken.mockReturnValue("mock-cookie-value");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ contact: mockContact }),
    });

    const { result } = renderHook(() => useHubspotCookieContactLookup());

    // Wait for the useEffect to complete
    await act(async () => {
      // Wait for the state to update
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.contactData).toEqual(mockContact);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(console.log).toHaveBeenCalledWith(
      "HubSpot contact data:",
      mockContact,
    );
    expect(console.log).toHaveBeenCalledWith("HubSpot contact ID:", "123");
  });

  test("should set error state on fetch failure", async () => {
    mockGetHubspotUserToken.mockReturnValue("mock-cookie-value");
    mockFetch.mockResolvedValue({
      ok: false,
      statusText: "Not Found",
    });

    const { result } = renderHook(() => useHubspotCookieContactLookup());

    // Wait for the useEffect to complete
    await act(async () => {
      // Wait for the state to update
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(
      "Failed to lookup contact: Not Found",
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.contactData).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  test("should handle fetch throwing an error", async () => {
    mockGetHubspotUserToken.mockReturnValue("mock-cookie-value");
    mockFetch.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useHubspotCookieContactLookup());

    // Wait for the useEffect to complete
    await act(async () => {
      // Wait for the state to update
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Network error");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.contactData).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  test("should handle manual call to lookupContactByCookie", async () => {
    const mockContact = {
      id: "123",
      properties: {
        email: "test@example.com",
      },
    };

    // First return mock cookie value for the automatic call
    mockGetHubspotUserToken.mockReturnValueOnce("mock-cookie-value");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ contact: mockContact }),
    });

    const { result } = renderHook(() => useHubspotCookieContactLookup());

    // Wait for the initial useEffect to complete
    await act(async () => {
      // Wait for the state to update
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Reset mocks for the manual call
    mockFetch.mockClear();

    // Trigger the manual lookup
    let returnValue;
    await act(async () => {
      returnValue = await result.current.lookupContactByCookie();
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(returnValue).toEqual(mockContact);
    expect(result.current.contactData).toEqual(mockContact);
  });
});
