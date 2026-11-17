/**
 * @jest-environment node
 */
import { ClientError } from "graphql-request";

import sdk, { withErrorReporting } from "./sdk";

import OakError from "@/errors/OakError";

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

const clientError = (status: number) =>
  new ClientError(
    { status, headers: new Headers(), body: "" },
    { query: "query test { test }" },
  );

const timeoutError = () =>
  new DOMException("The operation was aborted due to timeout", "TimeoutError");

const variables = { lessonSlug: "lesson-slug" };

describe("curriculum-api-2023 sdk", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockErrorReporter.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("withErrorReporting", () => {
    const callWithErrorReporting = <T>(action: () => Promise<T>) =>
      withErrorReporting(action, "testQuery", "query", variables);

    it("returns the result without reporting when the request succeeds", async () => {
      const action = jest.fn().mockResolvedValue("data");

      await expect(callWithErrorReporting(action)).resolves.toBe("data");
      expect(action).toHaveBeenCalledTimes(1);
      expect(mockErrorReporter).not.toHaveBeenCalled();
    });

    it("does not report a 403", async () => {
      const error = clientError(403);
      const action = jest.fn().mockRejectedValue(error);

      await expect(callWithErrorReporting(action)).rejects.toBe(error);
      expect(action).toHaveBeenCalledTimes(1);
      expect(mockErrorReporter).not.toHaveBeenCalled();
    });

    it.each([400, 404, 429, 500, 502, 503, 504, 200])(
      "does not retry a %s error and reports it once with its metadata",
      async (status) => {
        const error = clientError(status);
        const action = jest.fn().mockRejectedValue(error);

        await expect(callWithErrorReporting(action)).rejects.toBe(error);
        expect(action).toHaveBeenCalledTimes(1);
        expect(mockErrorReporter).toHaveBeenCalledTimes(1);

        const reported = mockErrorReporter.mock.calls[0][0];
        expect(reported).toBeInstanceOf(OakError);
        expect(reported.code).toBe("graphql/request-failed");
        expect(reported.originalError).toBe(error);
        expect(reported.meta).toEqual({
          queryName: "testQuery",
          variables,
          status,
        });
      },
    );

    it.each([
      [
        "a network error",
        new TypeError("fetch failed"),
        "graphql/request-failed",
      ],
      ["a timeout", timeoutError(), "graphql/timeout"],
      [
        "an abort",
        new DOMException("This operation was aborted", "AbortError"),
        "graphql/timeout",
      ],
    ])("reports a %s once", async (_, error, code) => {
      const action = jest.fn().mockRejectedValue(error);

      await expect(callWithErrorReporting(action)).rejects.toBe(error);
      expect(action).toHaveBeenCalledTimes(1);
      expect(mockErrorReporter).toHaveBeenCalledTimes(1);

      const reported = mockErrorReporter.mock.calls[0][0];
      expect(reported.code).toBe(code);
      expect(reported.originalError).toBe(error);
      expect(reported.meta).toEqual({
        queryName: "testQuery",
        variables,
        status: undefined,
      });
    });
  });

  describe("sdk client", () => {
    const jsonResponse = (status: number, body: unknown) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      });

    const callLessonShare = () =>
      sdk.lessonShare({
        programmeSlug: "programme",
        unitSlug: "unit",
        lessonSlug: "lesson",
      });

    it.each([429, 500, 502, 503, 504])("reports a %s once", async (status) => {
      const fetchSpy = jest
        .spyOn(global, "fetch")
        .mockResolvedValue(jsonResponse(status, { message: "Error" }));

      await expect(callLessonShare()).rejects.toBeInstanceOf(ClientError);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(mockErrorReporter).toHaveBeenCalledTimes(1);
      expect(mockErrorReporter.mock.calls[0][0].meta).toMatchObject({
        queryName: "lessonShare",
        status,
      });
    });

    it("does not report a WAF 403", async () => {
      const fetchSpy = jest
        .spyOn(global, "fetch")
        .mockResolvedValue(jsonResponse(403, { message: "Forbidden" }));

      await expect(callLessonShare()).rejects.toBeInstanceOf(ClientError);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(mockErrorReporter).not.toHaveBeenCalled();
    });
  });
});
