import {
  OakGoogleClassroomException,
  ErrorSeverity,
  ExceptionType,
} from "@oaknational/google-classroom-addon/server";
import { AuthCookieKeys } from "@oaknational/google-classroom-addon/ui";

import GoogleClassroomApi from "./googleClassroomApi";

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Create fetch mock helper
const mockJsonResponse = (data: unknown, status = 200) => {
  const statusText = status === 200 ? "OK" : "Error";
  const response = new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: {
      "Content-Type": "application/json",
    },
  });
  mockFetch.mockResolvedValue(response);
};

const mockJsonParseError = (
  status = 500,
  statusText = "Internal Server Error",
) => {
  const response = new Response("not-json", {
    status,
    statusText,
    headers: {
      "Content-Type": "application/json",
    },
  });
  jest.spyOn(response, "json").mockRejectedValue(new Error("Invalid JSON"));
  mockFetch.mockResolvedValue(response);
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
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe("getOakGCAuthHeaders", () => {
    it("should handle when cookieStore is undefined", async () => {
      // Arrange
      const originalCookieStore = globalThis.cookieStore;
      // @ts-expect-error - Testing undefined cookieStore
      delete globalThis.cookieStore;
      mockJsonResponse({ authenticated: false });

      // Act
      await GoogleClassroomApi.verifySession()();

      // Assert
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers).toBeUndefined();

      // Cleanup
      Object.defineProperty(globalThis, "cookieStore", {
        value: originalCookieStore,
        writable: true,
      });
    });
  });

  describe("getGoogleSignInUrl", () => {
    it("should call sign-in API without login_hint parameter when loginHint is null", async () => {
      // Arrange
      const mockUrl = "https://google.com/signin";
      mockJsonResponse({ signInUrl: mockUrl });

      // Act
      const result = await GoogleClassroomApi.getGoogleSignInUrl(null);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(`/api/classroom/auth/sign-in`, {
        credentials: "include",
        method: "GET",
        body: undefined,
        headers: undefined,
      });
      expect(result).toBe(mockUrl);
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

    it("should include is_pupil param when isPupil is true", async () => {
      // Arrange
      const loginHint = "123456789";
      const mockUrl = "https://google.com/signin";
      mockJsonResponse({ signInUrl: mockUrl });

      // Act
      const result = await GoogleClassroomApi.getGoogleSignInUrl(
        loginHint,
        undefined,
        true,
      );

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/classroom/auth/sign-in?login_hint=${loginHint}&is_pupil=true`,
        expect.objectContaining({
          credentials: "include",
          method: "GET",
        }),
      );
      expect(result).toBe(mockUrl);
    });

    it("should not include is_pupil param when isPupil is false or undefined", async () => {
      // Arrange
      const mockUrl = "https://google.com/signin";
      mockJsonResponse({ signInUrl: mockUrl });

      // Act
      await GoogleClassroomApi.getGoogleSignInUrl("hint", undefined, false);

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/classroom/auth/sign-in?login_hint=hint`,
        expect.objectContaining({
          credentials: "include",
          method: "GET",
        }),
      );
    });
  });

  describe("verifySession", () => {
    it("should include auth headers when cookies are present", async () => {
      // Arrange
      mockCookieStore.get.mockImplementation((name) => {
        if (name === AuthCookieKeys.Session)
          return Promise.resolve({ value: "test-session" });
        if (name === AuthCookieKeys.AccessToken)
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });

      mockJsonResponse({ authenticated: true });

      // Act
      await GoogleClassroomApi.verifySession()();

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
      await GoogleClassroomApi.verifySession()();

      // Assert
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers).toBeUndefined();
    });

    it("should call the verify API and return authenticated: true", async () => {
      // Arrange
      mockCookieStore.get.mockImplementation((name) => {
        if (name === AuthCookieKeys.Session)
          return Promise.resolve({ value: "test-session" });
        if (name === AuthCookieKeys.AccessToken)
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });
      mockJsonResponse({ authenticated: true });
      const expectedHeaders = new Headers();
      expectedHeaders.append("Authorization", "test-token");
      expectedHeaders.append("X-Oakgc-Session", "test-session");

      // Act
      const result = await GoogleClassroomApi.verifySession()();

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
        if (name === AuthCookieKeys.Session)
          return Promise.resolve({ value: "test-session" });
        if (name === AuthCookieKeys.AccessToken)
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });
      mockJsonResponse({ authenticated: false });

      // Act
      const result = await GoogleClassroomApi.verifySession()();

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ authenticated: false });
    });

    it("should return authenticated: false if API response is malformed", async () => {
      // Arrange
      mockCookieStore.get.mockImplementation((name) => {
        if (name === AuthCookieKeys.Session)
          return Promise.resolve({ value: "test-session" });
        if (name === AuthCookieKeys.AccessToken)
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });
      mockJsonResponse({});

      // Act
      const result = await GoogleClassroomApi.verifySession()();

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ authenticated: false });
    });

    it("should return session and token from API response", async () => {
      // Arrange
      mockCookieStore.get.mockImplementation((name) => {
        if (name === AuthCookieKeys.Session)
          return Promise.resolve({ value: "test-session" });
        if (name === AuthCookieKeys.AccessToken)
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });
      mockJsonResponse({
        authenticated: true,
        session: "new-session",
        token: "new-token",
      });

      // Act
      const result = await GoogleClassroomApi.verifySession()();

      // Assert
      expect(result).toEqual({
        authenticated: true,
        session: "new-session",
        token: "new-token",
      });
    });

    it("should use pupil cookie keys when isPupil is true", async () => {
      // Arrange
      mockCookieStore.get.mockImplementation((name) => {
        if (name === AuthCookieKeys.PupilAccessToken)
          return Promise.resolve({ value: "pupil-token-val" });
        if (name === AuthCookieKeys.PupilSession)
          return Promise.resolve({ value: "pupil-session-val" });
        return Promise.resolve(null);
      });
      mockJsonResponse({ authenticated: true });

      // Act
      await GoogleClassroomApi.verifySession(true)();

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/classroom/auth/verify`,
        expect.objectContaining({
          method: "GET",
          headers: expect.any(Headers),
        }),
      );
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers.get("Authorization")).toBeTruthy();
      expect(callArgs.headers.get("X-Oakgc-Session")).toBeTruthy();
    });

    it("should not include headers when pupil cookies are missing", async () => {
      // Arrange
      mockCookieStore.get.mockResolvedValue(null);
      mockJsonResponse({ authenticated: false });

      // Act
      await GoogleClassroomApi.verifySession(true)();

      // Assert
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers).toBeUndefined();
    });
  });

  describe("createAttachment", () => {
    it("should call the create attachment API with correct parameters", async () => {
      // Arrange
      mockCookieStore.get.mockImplementation((name) => {
        if (name === AuthCookieKeys.Session)
          return Promise.resolve({ value: "test-session" });
        if (name === AuthCookieKeys.AccessToken)
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });
      mockJsonResponse({});

      const attachment = {
        courseId: "course123",
        itemId: "item456",
        addOnToken: "token789",
        title: "Test Lesson",
        lessonSlug: "test-lesson",
        programmeSlug: "test-programme",
        unitSlug: "test-unit",
      };

      // Act
      await GoogleClassroomApi.createAttachment(attachment);

      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/classroom/attachment/create`,
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          body: JSON.stringify(attachment),
        }),
      );
    });

    it("should include auth headers when creating attachment", async () => {
      // Arrange
      mockCookieStore.get.mockImplementation((name) => {
        if (name === AuthCookieKeys.Session)
          return Promise.resolve({ value: "test-session" });
        if (name === AuthCookieKeys.AccessToken)
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });
      mockJsonResponse({});

      const attachment = {
        courseId: "course123",
        itemId: "item456",
        addOnToken: "token789",
        title: "Test Lesson",
        lessonSlug: "test-lesson",
        programmeSlug: "test-programme",
        unitSlug: "test-unit",
      };

      // Act
      await GoogleClassroomApi.createAttachment(attachment);

      // Assert
      const callArgs = mockFetch.mock.calls[0][1];
      expect(callArgs.headers.get("Authorization")).toBe("test-token");
      expect(callArgs.headers.get("X-Oakgc-Session")).toBe("test-session");
    });
  });

  describe("sendRequest error handling", () => {
    const mockAttachmentSetup = () => {
      mockCookieStore.get.mockImplementation((name) => {
        if (name === AuthCookieKeys.Session)
          return Promise.resolve({ value: "test-session" });
        if (name === AuthCookieKeys.AccessToken)
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });
    };

    const testAttachment = {
      courseId: "course123",
      itemId: "item456",
      addOnToken: "token789",
      title: "Test Lesson",
      lessonSlug: "test-lesson",
      programmeSlug: "test-programme",
      unitSlug: "test-unit",
    };

    it("should throw generic error when response is not ok and JSON parsing fails", async () => {
      // Arrange
      mockAttachmentSetup();
      mockJsonParseError(500, "Internal Server Error");

      // Act & Assert
      await expect(
        GoogleClassroomApi.createAttachment(testAttachment),
      ).rejects.toThrow("API request failed: 500 Internal Server Error");
    });

    it("should re-throw OakGoogleClassroomException errors", async () => {
      // Arrange
      mockAttachmentSetup();
      const oakError = new OakGoogleClassroomException(
        "Access was denied. Please grant permission to continue.",
        ExceptionType.GoogleOAuth,
        {
          code: "access_denied",
          shouldRetry: false,
          severity: ErrorSeverity.Error,
        },
      );

      mockJsonResponse(oakError.toObject(), 400);

      // Act & Assert
      await expect(
        GoogleClassroomApi.createAttachment(testAttachment),
      ).rejects.toEqual(oakError.toObject());
    });

    it("should throw error with error field from response", async () => {
      // Arrange
      mockAttachmentSetup();
      mockJsonResponse({ error: "Custom error message" }, 400);

      // Act & Assert
      await expect(
        GoogleClassroomApi.createAttachment(testAttachment),
      ).rejects.toThrow("Custom error message");
    });

    it("should throw error with details field from response when error field is missing", async () => {
      // Arrange
      mockAttachmentSetup();
      mockJsonResponse({ details: "Detailed error info" }, 400);

      // Act & Assert
      await expect(
        GoogleClassroomApi.createAttachment(testAttachment),
      ).rejects.toThrow("Detailed error info");
    });

    it("should throw generic status error when response has no error or details field", async () => {
      // Arrange
      mockAttachmentSetup();
      mockJsonResponse({ someOtherField: "value" }, 403);

      // Act & Assert
      await expect(
        GoogleClassroomApi.createAttachment(testAttachment),
      ).rejects.toThrow("Request failed with status 403");
    });

    it("should propagate OakGoogleClassroomException from createAttachment", async () => {
      // Arrange
      mockCookieStore.get.mockImplementation((name) => {
        if (name === AuthCookieKeys.Session)
          return Promise.resolve({ value: "test-session" });
        if (name === AuthCookieKeys.AccessToken)
          return Promise.resolve({ value: "test-token" });
        return Promise.resolve(null);
      });

      const oakError = new OakGoogleClassroomException(
        "User does not have permission",
        ExceptionType.Firestore,
        {
          code: "permission_denied",
          shouldRetry: false,
          severity: ErrorSeverity.Error,
        },
      );

      mockJsonResponse(oakError.toObject(), 403);

      const attachment = {
        courseId: "course123",
        itemId: "item456",
        addOnToken: "token789",
        title: "Test Lesson",
        lessonSlug: "test-lesson",
        programmeSlug: "test-programme",
        unitSlug: "test-unit",
      };

      // Act & Assert
      await expect(
        GoogleClassroomApi.createAttachment(attachment),
      ).rejects.toEqual(oakError.toObject());
    });

    it("should return default values when verifySession encounters an error", async () => {
      // Arrange
      mockCookieStore.get.mockResolvedValue(null);
      mockJsonResponse({ error: "Server error" }, 500);

      // Act
      const result = await GoogleClassroomApi.verifySession()();

      // Assert
      expect(result).toEqual({
        authenticated: false,
        session: undefined,
        token: undefined,
        userProfilePicUrl: undefined,
      });
    });

    it("should return null when getGoogleSignInUrl encounters an error", async () => {
      // Arrange
      mockJsonResponse({ error: "Server error" }, 500);

      // Act
      const result = await GoogleClassroomApi.getGoogleSignInUrl("test");

      // Assert
      expect(result).toBeNull();
    });
  });
});
