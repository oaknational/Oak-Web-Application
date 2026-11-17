/**
 * @jest-environment node
 */
import { GraphQLClient } from "graphql-request";

import { fetchWithRetry } from "./fetchWithRetry";

const fetchSpy = jest.spyOn(global, "fetch");

const response = (status: number) =>
  new Response(JSON.stringify({ data: {} }), { status });

const callFetchWithRetry = async () => {
  const promise = fetchWithRetry("https://example.com/graphql", {
    method: "POST",
    body: "{}",
  });
  // Swallow the rejection here so it isn't unhandled while timers advance
  promise.catch(() => {});
  await jest.runAllTimersAsync();
  return promise;
};

describe("fetchWithRetry", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    fetchSpy.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns the response without retrying when the request succeeds", async () => {
    fetchSpy.mockResolvedValueOnce(response(200));

    const res = await callFetchWithRetry();

    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it.each([429, 502, 503, 504])(
    "retries on a %i response then returns the successful response",
    async (status) => {
      fetchSpy
        .mockResolvedValueOnce(response(status))
        .mockResolvedValueOnce(response(200));

      const res = await callFetchWithRetry();

      expect(res.status).toBe(200);
      expect(fetchSpy).toHaveBeenCalledTimes(2);
      expect(fetchSpy).toHaveBeenLastCalledWith("https://example.com/graphql", {
        method: "POST",
        body: "{}",
      });
    },
  );

  it("waits the fixed delay before retrying", async () => {
    fetchSpy
      .mockResolvedValueOnce(response(503))
      .mockResolvedValueOnce(response(200));

    const promise = fetchWithRetry("https://example.com/graphql");

    await jest.advanceTimersByTimeAsync(199);
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(1);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    await expect(promise).resolves.toHaveProperty("status", 200);
  });

  it("retries when fetch fails with a network error", async () => {
    const socketError = Object.assign(new Error("other side closed"), {
      code: "UND_ERR_SOCKET",
    });
    fetchSpy
      .mockRejectedValueOnce(
        new TypeError("fetch failed", { cause: socketError }),
      )
      .mockResolvedValueOnce(response(200));

    const res = await callFetchWithRetry();

    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it.each([400, 401, 404, 500])(
    "does not retry a %i response",
    async (status) => {
      fetchSpy.mockResolvedValueOnce(response(status));

      const res = await callFetchWithRetry();

      expect(res.status).toBe(status);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    },
  );

  it("does not retry GraphQL errors returned with a 200", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          errors: [{ message: 'Cannot query field "foo" on type "Query".' }],
        }),
        { status: 200 },
      ),
    );

    const res = await callFetchWithRetry();

    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("does not retry aborted requests", async () => {
    const abortError = new DOMException("aborted", "AbortError");
    fetchSpy.mockRejectedValueOnce(abortError);

    await expect(callFetchWithRetry()).rejects.toBe(abortError);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("returns the last response after the max attempts so it is still reported", async () => {
    fetchSpy.mockResolvedValue(response(502));

    const res = await callFetchWithRetry();

    expect(res.status).toBe(502);
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it("rethrows the network error after the max attempts", async () => {
    const fetchFailed = new TypeError("fetch failed");
    fetchSpy.mockRejectedValue(fetchFailed);

    await expect(callFetchWithRetry()).rejects.toBe(fetchFailed);
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  describe("with GraphQLClient", () => {
    const client = new GraphQLClient("https://example.com/graphql", {
      fetch: fetchWithRetry,
    });
    const query = "{ allBlogPosts { id } }";

    it("resolves the query after a transient 502", async () => {
      fetchSpy
        .mockResolvedValueOnce(new Response("temporary error", { status: 502 }))
        .mockResolvedValueOnce(
          Response.json({ data: { allBlogPosts: [] } }, { status: 200 }),
        );

      const promise = client.request(query);
      await jest.runAllTimersAsync();

      await expect(promise).resolves.toEqual({ allBlogPosts: [] });
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it("throws GraphQL errors without retrying", async () => {
      fetchSpy.mockResolvedValueOnce(
        Response.json(
          {
            errors: [{ message: 'Cannot query field "foo" on type "Query".' }],
          },
          { status: 200 },
        ),
      );

      await expect(client.request(query)).rejects.toThrow("Cannot query field");
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
