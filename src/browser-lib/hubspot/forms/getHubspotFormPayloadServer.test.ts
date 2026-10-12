/**
 * @jest-environment node
 */
import { getHubspotNewsletterPayload } from "./getHubspotFormPayloads";

describe("getHubspotNewsletterPayload() outside the browser", () => {
  test("page values fall back to empty strings when there is no window", () => {
    const result = getHubspotNewsletterPayload({
      hutk: "hubspotutk value 123",
      data: {
        email: "email value",
        name: "full_name value",
        userRole: "Student",
        oakUserId: "oak_user_id value",
      },
    });

    expect(result.context).toEqual({
      hutk: "hubspotutk value 123",
      pageUri: "",
      pageName: "",
    });
  });
});
