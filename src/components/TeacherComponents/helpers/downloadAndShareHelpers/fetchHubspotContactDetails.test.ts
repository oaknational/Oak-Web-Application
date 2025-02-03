import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

import { fetchHubspotContactDetails } from "./fetchHubspotContactDetails";

import OakError from "@/errors/OakError";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

describe(fetchHubspotContactDetails, () => {
  it("returns the contact from the response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ email: "foo@example.com" }), {
      status: 200,
    });

    expect(await fetchHubspotContactDetails()).toEqual({
      email: "foo@example.com",
    });
  });

  it("returns null when there is no contact", async () => {
    fetchMock.mockResponseOnce(() =>
      Promise.resolve({
        ok: true,
        status: 204,
        json: () => Promise.resolve(null),
      }),
    );

    expect(await fetchHubspotContactDetails()).toEqual(null);
  });

  it("throws when there is an error", () => {
    fetchMock.mockResponseOnce("", { status: 500 });

    expect(fetchHubspotContactDetails()).rejects.toBeInstanceOf(OakError);
  });
});
