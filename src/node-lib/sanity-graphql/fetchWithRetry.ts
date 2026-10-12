/**
 * Sanity's edge occasionally returns transient 5xx responses, and pooled
 * keep-alive sockets can be closed by Sanity between our (infrequent, cached)
 * requests, which surfaces as `TypeError: fetch failed`. Retry those briefly.
 *
 * Anything else (4xx, or GraphQL errors returned with a 200) is passed
 * straight through, and the final attempt's result is returned as-is so
 * persistent failures are still reported.
 */
const RETRY_DELAYS_MS = [200, 600];
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

// fetch rejects with a TypeError for network failures (aborts are a DOMException)
const isNetworkError = (err: unknown) => err instanceof TypeError;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchWithRetry: typeof fetch = async (input, init) => {
  for (let attempt = 0; ; attempt++) {
    const canRetry = attempt < RETRY_DELAYS_MS.length;

    try {
      const response = await fetch(input, init);
      if (!canRetry || !RETRYABLE_STATUSES.has(response.status)) {
        return response;
      }
      // Free the connection before retrying
      await response.body?.cancel();
    } catch (err) {
      if (!canRetry || !isNetworkError(err)) {
        throw err;
      }
    }

    const delay = RETRY_DELAYS_MS[attempt]!;
    await sleep(delay + Math.random() * delay * 0.5);
  }
};
