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

describe("Google Classroom API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGoogleSignInUrl", () => {
    it("should return null if loginHint is null", async () => {
      // Act
      const result = await GoogleClassroomApi.getGoogleSignInUrl(null);

      // Assert
      expect(result).toBeNull();
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
    it("should call the verify API and return authenticated: true", async () => {
      // Arrange
      const session = "valid_session";
      mockJsonResponse({ authenticated: true });

      // Act
      const result = await GoogleClassroomApi.verifySession(session);

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(`/api/classroom/auth/verify`, {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ session }),
      });
      expect(result).toEqual({ authenticated: true });
    });

    it("should return authenticated: false if API returns false", async () => {
      // Arrange
      const session = "invalid_session";
      mockJsonResponse({ authenticated: false });

      // Act
      const result = await GoogleClassroomApi.verifySession(session);

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ authenticated: false });
    });

    it("should return authenticated: false if API response is malformed", async () => {
      // Arrange
      const session = "valid_session";
      mockJsonResponse({});

      // Act
      const result = await GoogleClassroomApi.verifySession(session);

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ authenticated: false });
    });
  });
});
