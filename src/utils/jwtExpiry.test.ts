import { isJwtExpiring } from "./jwtExpiry";

/**
 * Helper function to create a mock JWT token with a given expiration time.
 *
 * @param expiresInSeconds - the number of seconds until the token expires
 */
const createMockJwt = (expiresInSeconds: number): string => {
  const currentTime = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = { exp: currentTime + expiresInSeconds };

  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(payload));
  const signature = "mock_signature";

  return `${base64Header}.${base64Payload}.${signature}`;
};

describe("isJwtExpiring", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-02-27T00:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test("should return true when token is expiring within threshold", () => {
    // Create a token that expires in 30 seconds
    const token = createMockJwt(30);

    // Check if token is expiring with a 60s threshold
    const result = isJwtExpiring(token, 60);

    expect(result).toBe(true);
  });

  test("should return false when token is not expiring within threshold", () => {
    // Create a token that expires in 120 seconds
    const token = createMockJwt(120);

    // Check if token is expiring with a 60s threshold
    const result = isJwtExpiring(token, 60);

    expect(result).toBe(false);
  });

  test("should return true when token is exactly at the threshold", () => {
    // Create a token that expires in 60 seconds
    const token = createMockJwt(60);

    // Check if token is expiring with a 60s threshold
    const result = isJwtExpiring(token, 60);

    expect(result).toBe(true);
  });

  test("should return true when token is already expired", () => {
    // Create a token that expired 10 seconds ago
    const token = createMockJwt(-10);

    // Check if token is expiring with any threshold
    const result = isJwtExpiring(token, 60);

    expect(result).toBe(true);
  });

  test("should return true when token has invalid format", () => {
    const invalidToken = "invalid.token";
    const result = isJwtExpiring(invalidToken, 60);

    expect(result).toBe(true);
  });

  test("should return true when payload cannot be parsed", () => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const invalidPayload = "not-valid-base64";
    const signature = "mock_signature";

    const invalidToken = `${header}.${invalidPayload}.${signature}`;

    const result = isJwtExpiring(invalidToken, 60);

    expect(result).toBe(true);
  });

  test("should return true when payload is missing exp claim", () => {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = { sub: "user123" };

    const base64Header = btoa(JSON.stringify(header));
    const base64Payload = btoa(JSON.stringify(payload));
    const signature = "mock_signature";

    const invalidToken = `${base64Header}.${base64Payload}.${signature}`;

    const result = isJwtExpiring(invalidToken, 60);

    expect(result).toBe(true);
  });

  test("should handle zero threshold correctly", () => {
    // Create a token that expires in 1 second
    const token = createMockJwt(1);

    // With zero threshold, any token not yet expired should return false
    const result = isJwtExpiring(token, 0);

    expect(result).toBe(false);
  });

  test("should handle different threshold values", () => {
    // Create a token that expires in 100 seconds
    const token = createMockJwt(100);

    // Test different thresholds
    expect(isJwtExpiring(token, 50)).toBe(false); // More than 50 seconds left, not expiring
    expect(isJwtExpiring(token, 100)).toBe(true); // Exactly 100 seconds left, expiring
    expect(isJwtExpiring(token, 150)).toBe(true); // Less than 150 seconds left, expiring
  });

  test("should detect expiration after time passes", () => {
    // Create a token that expires in 120 seconds
    const token = createMockJwt(120);

    // Should not be expiring yet with a 60s threshold
    expect(isJwtExpiring(token, 60)).toBe(false);

    // Advance time by 70 seconds
    jest.advanceTimersByTime(70 * 1000);

    // Now should be expiring (50 seconds left, threshold is 60)
    expect(isJwtExpiring(token, 60)).toBe(true);
  });
});
