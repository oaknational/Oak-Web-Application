/**
 * @jest-environment node
 */
import { ClientError } from "graphql-request";

import sdk, {
  ATTEMPT_TIMEOUT_MS,
  fetchWithTimeout,
  isRetryableError,
  withRetries,
} from "./sdk";

import OakError from "@/errors/OakError";

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

const fetchSpy = jest.spyOn(global, "fetch");

const clientError = (status: number) =>
  new ClientError(
    { status, headers: new Headers(), body: "" },
    { query: "query test { test }" },
  );

const timeoutError = () =>
  new DOMException("The operation was aborted due to timeout", "TimeoutError");

const variables = { lessonSlug: "lesson-slug" };

const callWithRetries = async <T>(action: () => Promise<T>) => {
  const promise = withRetries(action, "testQuery", "query", variables);
  // Swallow the rejection here so it isn't unhandled while timers advance
  promise.catch(() => {});
  await jest.runAllTimersAsync();
  return promise;
};

describe("curriculum-api-2023 sdk", () => {
  beforeEach(() => {
    fetchSpy.mockReset();
    mockErrorReporter.mockReset();
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("isRetryableError", () => {
    it.each([
      ["a network error", new TypeError("fetch failed")],
      ["a timeout", timeoutError()],
      [
        "an abort",
        new DOMException("This operation was aborted", "AbortError"),
      ],
      ["a 429 response", clientError(429)],
      ["a 502 response", clientError(502)],
      ["a 503 response", clientError(503)],
      ["a 504 response", clientError(504)],
    ])("retries %s", (_, error) => {
      expect(isRetryableError(error)).toBe(true);
    });

    it.each([
      ["a 400 response", clientError(400)],
      ["a 403 (WAF) response", clientError(403)],
      ["a 404 response", clientError(404)],
      ["a 500 response", clientError(500)],
      ["GraphQL errors returned with a 200", clientError(200)],
      ["a generic error", new Error("boom")],
      ["a non-error value", "boom"],
    ])("does not retry %s", (_, error) => {
      expect(isRetryableError(error)).toBe(false);
    });
  });

  describe("withRetries", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("returns the result without reporting when the first attempt succeeds", async () => {
      const action = jest.fn().mockResolvedValue("data");

      await expect(callWithRetries(action)).resolves.toBe("data");
      expect(action).toHaveBeenCalledTimes(1);
      expect(mockErrorReporter).not.toHaveBeenCalled();
    });

    it("retries a transient failure and does not report if a retry succeeds", async () => {
      const action = jest
        .fn()
        .mockRejectedValueOnce(clientError(503))
        .mockRejectedValueOnce(timeoutError())
        .mockRejectedValueOnce(new TypeError("fetch failed"))
        .mockResolvedValueOnce("data");

      await expect(callWithRetries(action)).resolves.toBe("data");
      expect(action).toHaveBeenCalledTimes(4);
      expect(mockErrorReporter).not.toHaveBeenCalled();
    });

    it("does not retry a 403 and reports it once with the original error, variables and status", async () => {
      const error = clientError(403);
      const action = jest.fn().mockRejectedValue(error);

      await expect(callWithRetries(action)).rejects.toBe(error);
      expect(action).toHaveBeenCalledTimes(1);
      expect(mockErrorReporter).toHaveBeenCalledTimes(1);

      const reported = mockErrorReporter.mock.calls[0][0];
      expect(reported).toBeInstanceOf(OakError);
      expect(reported.code).toBe("graphql/request-failed");
      expect(reported.originalError).toBe(error);
      expect(reported.meta).toEqual({
        queryName: "testQuery",
        variables,
        status: 403,
      });
    });

    it("reports a persistent timeout once as graphql/timeout after the final attempt", async () => {
      const error = timeoutError();
      const action = jest.fn().mockRejectedValue(error);

      await expect(callWithRetries(action)).rejects.toBe(error);
      expect(action).toHaveBeenCalledTimes(4);
      expect(mockErrorReporter).toHaveBeenCalledTimes(1);

      const reported = mockErrorReporter.mock.calls[0][0];
      expect(reported.code).toBe("graphql/timeout");
      expect(reported.originalError).toBe(error);
      expect(reported.meta).toEqual({
        queryName: "testQuery",
        variables,
        status: undefined,
      });
    });

    it("reports a persistent 503 as graphql/request-failed after the final attempt", async () => {
      const action = jest.fn().mockRejectedValue(clientError(503));

      await expect(callWithRetries(action)).rejects.toBeInstanceOf(ClientError);
      expect(action).toHaveBeenCalledTimes(4);
      expect(mockErrorReporter).toHaveBeenCalledTimes(1);
      expect(mockErrorReporter.mock.calls[0][0].code).toBe(
        "graphql/request-failed",
      );
      expect(mockErrorReporter.mock.calls[0][0].meta.status).toBe(503);
    });
  });

  describe("fetchWithTimeout", () => {
    it("adds a per-attempt timeout signal to each request", async () => {
      const timeoutSignal = new AbortController().signal;
      const timeoutSpy = jest
        .spyOn(AbortSignal, "timeout")
        .mockReturnValue(timeoutSignal);
      fetchSpy.mockResolvedValue(new Response("{}"));

      await fetchWithTimeout("https://example.com/graphql", { method: "POST" });

      expect(timeoutSpy).toHaveBeenCalledWith(ATTEMPT_TIMEOUT_MS);
      expect(fetchSpy).toHaveBeenCalledWith("https://example.com/graphql", {
        method: "POST",
        signal: timeoutSignal,
      });
    });

    it("still honours a caller-provided signal", async () => {
      fetchSpy.mockResolvedValue(new Response("{}"));
      const controller = new AbortController();

      await fetchWithTimeout("https://example.com/graphql", {
        signal: controller.signal,
      });

      const signal = fetchSpy.mock.calls[0]![1]!.signal!;
      expect(signal.aborted).toBe(false);
      controller.abort();
      expect(signal.aborted).toBe(true);
    });

    it("aborts a request that exceeds the timeout", async () => {
      jest.spyOn(AbortSignal, "timeout").mockImplementation(() => {
        const controller = new AbortController();
        controller.abort(timeoutError());
        return controller.signal;
      });
      fetchSpy.mockImplementation((_input, init) =>
        init?.signal?.aborted
          ? Promise.reject(init.signal.reason)
          : Promise.resolve(new Response("{}")),
      );

      await expect(
        fetchWithTimeout("https://example.com/graphql"),
      ).rejects.toHaveProperty("name", "TimeoutError");
    });
  });

  describe("sdk client", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const jsonResponse = (status: number, body: unknown) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      });

    const callLessonShare = async () => {
      const promise = sdk.lessonShare({
        programmeSlug: "programme",
        unitSlug: "unit",
        lessonSlug: "lesson",
      });
      promise.catch(() => {});
      await jest.runAllTimersAsync();
      return promise;
    };

    it("sends requests with a timeout signal and retries a 503", async () => {
      fetchSpy
        .mockResolvedValueOnce(jsonResponse(503, {}))
        .mockResolvedValueOnce(jsonResponse(200, { data: { share: [] } }));

      await expect(callLessonShare()).resolves.toEqual({ share: [] });
      expect(fetchSpy).toHaveBeenCalledTimes(2);
      expect(fetchSpy.mock.calls[0]![1]!.signal).toBeInstanceOf(AbortSignal);
      expect(mockErrorReporter).not.toHaveBeenCalled();
    });

    it("does not retry a WAF 403", async () => {
      fetchSpy.mockResolvedValue(jsonResponse(403, { message: "Forbidden" }));

      await expect(callLessonShare()).rejects.toBeInstanceOf(ClientError);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(mockErrorReporter).toHaveBeenCalledTimes(1);
      expect(mockErrorReporter.mock.calls[0][0].meta).toMatchObject({
        queryName: "lessonShare",
        status: 403,
      });
    });
  });
});
