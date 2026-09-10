import { notFound, unstable_rethrow } from "next/navigation";

import withPageErrorHandling from "./withPageErrorHandling";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  unstable_rethrow: jest.fn(),
}));

jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()),
  initialiseBugsnag: jest.fn(),
  initialiseSentry: jest.fn(),
}));

jest.mock("@/browser-lib/getBrowserConfig", () => ({
  __esModule: true,
  default: jest.fn(() => "false"),
}));

const mockReport = jest.fn();

describe("withPageErrorHandling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (errorReporter as jest.Mock).mockReturnValue(mockReport);
    (getBrowserConfig as jest.Mock).mockReturnValue("false");
    // default: does not identify the error as a Next.js internal signal
    (unstable_rethrow as jest.Mock).mockImplementation(() => undefined);
  });

  it("returns the result of the wrapped component when it succeeds", async () => {
    const AsyncComponent = jest.fn(async () => "page content");
    const WrappedPage = withPageErrorHandling(AsyncComponent, "test-page");

    const result = await WrappedPage({ params: Promise.resolve({}) });

    expect(result).toBe("page content");
    expect(mockReport).not.toHaveBeenCalled();
  });

  it("calls notFound() and does not report when an OakError with a 404 status is thrown", async () => {
    const oakError = new OakError({ code: "curriculum-api/not-found" });
    const AsyncComponent = jest.fn(async () => {
      throw oakError;
    });
    const WrappedPage = withPageErrorHandling(AsyncComponent, "test-page");

    await expect(WrappedPage({ params: Promise.resolve({}) })).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );

    expect(notFound).toHaveBeenCalled();
    expect(mockReport).not.toHaveBeenCalled();
  });

  it("rethrows Next.js internal control-flow errors without reporting them", async () => {
    const redirectError = new Error("NEXT_REDIRECT");
    (unstable_rethrow as jest.Mock).mockImplementation((error) => {
      throw error;
    });
    const AsyncComponent = jest.fn(async () => {
      throw redirectError;
    });
    const WrappedPage = withPageErrorHandling(AsyncComponent, "test-page");

    await expect(WrappedPage({ params: Promise.resolve({}) })).rejects.toThrow(
      redirectError,
    );

    expect(unstable_rethrow).toHaveBeenCalledWith(redirectError);
    expect(mockReport).not.toHaveBeenCalled();
  });

  it("reports and rethrows unexpected errors, including page params in the report", async () => {
    const genericError = new Error("Something went wrong");
    const AsyncComponent = jest.fn(async () => {
      throw genericError;
    });
    const WrappedPage = withPageErrorHandling(AsyncComponent, "test-page");

    await expect(
      WrappedPage({ params: Promise.resolve({ slug: "test-slug" }) }),
    ).rejects.toThrow(genericError);

    expect(unstable_rethrow).toHaveBeenCalledWith(genericError);
    expect(errorReporter).toHaveBeenCalledWith("test-page");
    expect(mockReport).toHaveBeenCalledWith(genericError, {
      slug: "test-slug",
    });
  });
});
