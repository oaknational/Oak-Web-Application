import fetchMock from "jest-fetch-mock";

import { fetchHubspotContactDetails } from "./fetchHubspotContactDetails";

fetchMock.enableMocks();

describe(fetchHubspotContactDetails, () => {
  it("returns the contact from the response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ email: "foo@example.com" }), {
      status: 200,
    });

    expect(await fetchHubspotContactDetails("foo@example.com")).toEqual({
      email: "foo@example.com",
    });
  });

  it("returns null when there is no contact", async () => {
    fetchMock.mockResponseOnce("", { status: 204 });

    expect(await fetchHubspotContactDetails("foo@example.com")).toEqual(null);
  });
});
