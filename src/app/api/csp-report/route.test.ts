import { NextRequest } from "next/server";
import { headers } from "next/headers";

import { POST } from "./route";

// Mocks
const mockReportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default: jest.fn(() => mockReportError),
  initialiseBugsnag: jest.fn(),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn(),
}));

const createMockRequest = async (
  jsonBody = {},
  headerMap: Record<string, string> = {},
  url: string = "http://localhost:3000",
): Promise<NextRequest> => {
  (headers as jest.Mock).mockReturnValue(new Map(Object.entries(headerMap)));

  return {
    json: jest.fn().mockResolvedValue(jsonBody),
    url: url,
  } as unknown as NextRequest;
};

// Fixtures
const cspReportFixture = {
  "csp-report": { "blocked-uri": "https://not-oak.com" },
};

// Console Spy
let consoleErrorSpy: jest.SpyInstance;

describe("CSP Report API Route (POST)", () => {
  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully report a CSP violation", async () => {
    // Arrange
    const req = await createMockRequest(cspReportFixture, {
      Origin: "http://localhost:3000",
    });

    // Act
    const response = await POST(req);

    // Assert
    expect(response.status).toBe(204);
    expect(mockReportError).toHaveBeenCalledWith(cspReportFixture);
    expect(mockReportError).toHaveBeenCalledTimes(1);
  });

  it("should return 400 if the request body is invalid JSON", async () => {
    // Arrange
    const req = await createMockRequest(
      {},
      {
        Origin: "http://localhost:3000",
      },
    );
    (req.json as jest.Mock).mockRejectedValue(
      new Error("Failed to call .json"),
    );

    // Act
    const response = await POST(req);

    // Assert
    expect(response.status).toBe(400);
    expect(mockReportError).not.toHaveBeenCalled();
  });
});
