import createFetchMock from "vitest-fetch-mock";
import { vi } from "vitest";

import { getSubscriptionStatus } from "./getSubscriptionStatus";

import OakError from "@/errors/OakError";

const fetchMocker = createFetchMock(vi);

describe("getSubscriptionStatus", () => {
  beforeAll(() => {
    fetchMocker.enableMocks();
  });
  afterAll(() => {
    fetchMocker.disableMocks();
  });

  it("makes a request to get the subscription status", async () => {
    fetchMock.mockResponse(JSON.stringify(true));
    const callback = vi.fn();
    await getSubscriptionStatus(callback);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching("/api/hubspot/subscription"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionName: "School Support",
        }),
      }),
    );
  });
  it("calls the callback with the response JSON", async () => {
    fetchMock.mockResponse(JSON.stringify(true));
    const callback = vi.fn();
    await getSubscriptionStatus(callback);
    expect(callback).toHaveBeenCalledWith(true);
  });
  it("throws an error if the response is not valid", async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    await expect(getSubscriptionStatus(vi.fn())).rejects.toEqual(
      expect.any(OakError),
    );
  });
});
