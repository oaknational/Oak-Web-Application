import fetchMock from "jest-fetch-mock";

import { getSubscriptionStatus } from "./getSubscriptionStatus";

import OakError from "@/errors/OakError";

describe("getSubscriptionStatus", () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });
  afterAll(() => {
    fetchMock.disableMocks();
  });

  it("makes a request to get the subscription status", async () => {
    fetchMock.mockResponse(JSON.stringify(true));
    await getSubscriptionStatus(jest.fn);
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
    const callback = jest.fn();
    await getSubscriptionStatus(callback);
    expect(callback).toHaveBeenCalledWith(true);
  });
  it("throws an error if the response is not valid", async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    await expect(getSubscriptionStatus(jest.fn)).rejects.toEqual(
      expect.any(OakError),
    );
  });
});
