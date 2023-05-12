import {
  getHubspotDownloadsFormPayload,
  getHubspotNewsletterPayload,
} from "./getHubspotFormPayloads";

describe("getHubspotNewsletterFormPayload()", () => {
  test("primary form payload is correct", () => {
    expect(
      getHubspotNewsletterPayload({
        hutk: "hubspotutk value 123",
        data: {
          email: "email value",
          name: "full_name value",
          userRole: "Student",
          oakUserId: "oak_user_id value",
          utm_campaign: "a campaign",
          utm_content: "some content",
          utm_medium: "some medium",
          utm_source: "a source",
          utm_term: "term",
        },
      })
    ).toEqual({
      fields: [
        { name: "email", value: "email value" },
        { name: "full_name", value: "full_name value" },
        { name: "latest_utm_campaign", value: "a campaign" },
        { name: "latest_utm_content", value: "some content" },
        { name: "latest_utm_medium", value: "some medium" },
        { name: "latest_utm_source", value: "a source" },
        { name: "latest_utm_term", value: "term" },
        { name: "oak_user_id", value: "oak_user_id value" },
        { name: "user_type", value: "Student" },
      ],
      context: {
        hutk: "hubspotutk value 123",
        pageUri: "http://localhost/",
        pageName: "",
      },
    });
  });
  test("fallback form payload is correct", () => {
    expect(
      getHubspotNewsletterPayload({
        hutk: "hubspotutk value 456",
        data: {
          emailTextOnly: "email value",
          name: "full_name value",
          userRole: "Parent",
          oakUserId: "oak_user_id value",
        },
      })
    ).toEqual({
      fields: [
        { name: "email_text_only", value: "email value" },
        { name: "full_name", value: "full_name value" },
        { name: "oak_user_id", value: "oak_user_id value" },
        { name: "user_type", value: "Parent" },
      ],
      context: {
        hutk: "hubspotutk value 456",
        pageUri: "http://localhost/",
        pageName: "",
      },
    });
  });
  test("falsy values are removed", () => {
    expect(
      getHubspotNewsletterPayload({
        hutk: "hubspotutk value 456",
        data: {
          emailTextOnly: "email value",
          name: "full_name value",
          userRole: "",
          oakUserId: "oak_user_id value",
        },
      })
    ).toEqual({
      fields: [
        { name: "email_text_only", value: "email value" },
        { name: "full_name", value: "full_name value" },
        { name: "oak_user_id", value: "oak_user_id value" },
      ],
      context: {
        hutk: "hubspotutk value 456",
        pageUri: "http://localhost/",
        pageName: "",
      },
    });
  });
});
describe("getHubspotDownloadFormPayload()", () => {
  test("primary form payload is correct", () => {
    expect(
      getHubspotDownloadsFormPayload({
        hutk: "hubspotutk value 123",
        data: {
          email: "email value",
          schoolName: "school_name value",
          school: "school_id value",
          oakUserId: "oak_user_id value",
          utm_campaign: "a campaign",
          utm_content: "some content",
          utm_medium: "some medium",
          utm_source: "a source",
          utm_term: "term",
        },
      })
    ).toEqual({
      fields: [
        { name: "contact_school_name", value: "school_name value" },
        { name: "contact_school_urn", value: "school_id value" },
        { name: "email", value: "email value" },
        { name: "latest_utm_campaign", value: "a campaign" },
        { name: "latest_utm_content", value: "some content" },
        { name: "latest_utm_medium", value: "some medium" },
        { name: "latest_utm_source", value: "a source" },
        { name: "latest_utm_term", value: "term" },
        { name: "oak_user_id", value: "oak_user_id value" },
      ],
      context: {
        hutk: "hubspotutk value 123",
        pageUri: "http://localhost/",
        pageName: "",
      },
    });
  });
  test("if schoolId === homeschool or notListed return schoolName as schoolId", () => {
    expect(
      getHubspotDownloadsFormPayload({
        hutk: "hubspotutk value 123",
        data: {
          email: "email value",
          schoolName: "school_name value",
          school: "notListed",
          oakUserId: "oak_user_id value",
          utm_campaign: "a campaign",
          utm_content: "some content",
          utm_medium: "some medium",
          utm_source: "a source",
          utm_term: "term",
        },
      })
    ).toEqual({
      fields: [
        { name: "contact_school_name", value: "school_name value" },
        { name: "email", value: "email value" },
        { name: "latest_utm_campaign", value: "a campaign" },
        { name: "latest_utm_content", value: "some content" },
        { name: "latest_utm_medium", value: "some medium" },
        { name: "latest_utm_source", value: "a source" },
        { name: "latest_utm_term", value: "term" },
        { name: "oak_user_id", value: "oak_user_id value" },
      ],
      context: {
        hutk: "hubspotutk value 123",
        pageUri: "http://localhost/",
        pageName: "",
      },
    });
  });
});
