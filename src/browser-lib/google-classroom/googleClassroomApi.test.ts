import GoogleClassroomApi from "./googleClassroomApi";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Create fetch mock helper
const mockJsonResponse = (data: unknown, status = 200) => {
  mockFetch.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as Response);
};

// Mock cookieStore
const mockCookieStore = {
  get: jest.fn(),
};

Object.defineProperty(window, "cookieStore", {
  value: mockCookieStore,
  writable: true,
});

describe("Google Classroom API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGoogleSignInUrl", () => {
    it("should throw an error if loginHint is null", async () => {
      // Act & Assert
      await expect(GoogleClassroomApi.getGoogleSignInUrl(null)).rejects.toThrow(
        "Login hint is required for Google Classroom sign-in. Please ensure you are accessing this page from within Google Classroom.",
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should call the sign-in API and return the signInUrl", async () => {
      // Arrange
      const loginHint = "123456789";
      const mockUrl = "https://google.com/signin";
      mockJsonResponse({ signInUrl: mockUrl });

      // Act
      const result = await GoogleClassroomApi.getGoogleSignInUrl(loginHint);

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/classroom/auth/sign-in?login_hint=${loginHint}`,
        {
          credentials: "include",
          method: "GET",
          body: undefined,
        },
      );
      expect(result).toBe(mockUrl);
    });

    it("should return null if the API response is missing signInUrl", async () => {
      // Arrange
      const loginHint = "user@example.com";
      mockJsonResponse({});

      // Act
      const result = await GoogleClassroomApi.getGoogleSignInUrl(loginHint);

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe("verifySession", () => {
    it("should include auth headers when cookies are present", async () => {
      // Arrange
      mockCookieStore.get.mockImplementation((name) => {
        if (name === "oak-gclassroom-session")
          return Promise.resolve({ value: "test-session" });
        if (name === "oak-gclassroom-token")
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });

      mockJsonResponse({ authenticated: true });

      // Act
      await GoogleClassroomApi.verifySession();

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/classroom/auth/verify`,
        expect.objectContaining({
          method: "GET",
          headers: expect.any(Headers),
        }),
      );
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers.get("Authorization")).toBe("test-token");
      expect(callArgs.headers.get("X-Oakgc-Session")).toBe("test-session");
    });

    it("should not include headers if cookies are missing", async () => {
      // Arrange
      mockCookieStore.get.mockResolvedValue(null);
      mockJsonResponse({ authenticated: false });

      // Act
      await GoogleClassroomApi.verifySession();

      // Assert
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers).toBeUndefined();
    });

    it("should call the verify API and return authenticated: true", async () => {
      // Arrange
      mockCookieStore.get.mockImplementation((name) => {
        if (name === "oak-gclassroom-session")
          return Promise.resolve({ value: "test-session" });
        if (name === "oak-gclassroom-token")
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });
      mockJsonResponse({ authenticated: true });
      const expectedHeaders = new Headers();
      expectedHeaders.append("Authorization", "test-token");
      expectedHeaders.append("X-Oakgc-Session", "test-session");

      // Act
      const result = await GoogleClassroomApi.verifySession();

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(`/api/classroom/auth/verify`, {
        credentials: "include",
        method: "GET",
        headers: expectedHeaders,
      });
      expect(result).toEqual({ authenticated: true });
    });

    it("should return authenticated: false if API returns false", async () => {
      // Arrange
      mockCookieStore.get.mockImplementation((name) => {
        if (name === "oak-gclassroom-session")
          return Promise.resolve({ value: "test-session" });
        if (name === "oak-gclassroom-token")
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });
      mockJsonResponse({ authenticated: false });

      // Act
      const result = await GoogleClassroomApi.verifySession();

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ authenticated: false });
    });

    it("should return authenticated: false if API response is malformed", async () => {
      // Arrange
      mockCookieStore.get.mockImplementation((name) => {
        if (name === "oak-gclassroom-session")
          return Promise.resolve({ value: "test-session" });
        if (name === "oak-gclassroom-token")
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });
      mockJsonResponse({});

      // Act
      const result = await GoogleClassroomApi.verifySession();

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ authenticated: false });
    });
  });
});
