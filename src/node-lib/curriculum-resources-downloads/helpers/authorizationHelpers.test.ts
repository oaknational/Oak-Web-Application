import { checkDownloadAuthorization } from "./authorizationHelpers";

const mockNextResponseJson = jest.fn().mockImplementation((data, init) => ({
  status: init?.status ?? 200,
  json: async () => data,
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (...args: unknown[]) => mockNextResponseJson(...args),
  },
}));

const mockCurrentUser = jest.fn();

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: () => mockCurrentUser(),
}));

describe("checkDownloadAuthorization", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentUser.mockResolvedValue({
      id: "user-123",
      privateMetadata: { region: "GB" },
    });
  });

  it("should return true if resources is not geo restricted and no login required", async () => {
    const result = await checkDownloadAuthorization(false, false);
    expect(result).toEqual({ authorized: true, user: null });
  });

  it("should return true if the resource is geo restricted and the user is in the allowed regions", async () => {
    const result = await checkDownloadAuthorization(true, true);
    expect(result.authorized).toBe(true);
    expect(mockNextResponseJson).not.toHaveBeenCalled();
  });
  it("should return false if the resource is geo restricted and user is not in the allowed regions", async () => {
    jest.mocked(mockCurrentUser).mockResolvedValueOnce({
      id: "123",
      emailAddresses: [{ emailAddress: "test@example.com" }],
      privateMetadata: { region: "US" },
    });
    const result = await checkDownloadAuthorization(true, true);
    expect(result.authorized).toBe(false);
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Access restricted based on your location" } },
      { status: 403 },
    );
  });
  it("should return Access restricted based on your location error if the user is geo restricted and not in the allowed regions (login not required)", async () => {
    jest.mocked(mockCurrentUser).mockResolvedValueOnce({
      id: "123",
      emailAddresses: [{ emailAddress: "test@example.com" }],
      privateMetadata: { region: "US" },
    });
    const result = await checkDownloadAuthorization(true, false);
    expect(result.authorized).toBe(false);
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Access restricted based on your location" } },
      { status: 403 },
    );
  });

  it("should return Autentication required error if there is no user", async () => {
    mockCurrentUser.mockResolvedValueOnce(null);

    const result = await checkDownloadAuthorization(false, true);
    expect(result.authorized).toBe(false);
    expect(mockNextResponseJson).toHaveBeenCalledWith(
      { error: { message: "Authentication required" } },
      { status: 401 },
    );
  });
});
