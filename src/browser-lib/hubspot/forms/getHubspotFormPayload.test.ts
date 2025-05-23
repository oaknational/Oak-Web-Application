import {
  getHubspotDownloadsFormPayload,
  getHubspotNewsletterPayload,
  getHubspotOnboardingFormPayload,
} from "./getHubspotFormPayloads";

const originalWindow = window;

afterEach(() => {
  Object.defineProperty(globalThis, "window", {
    value: originalWindow,
  });
});

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
      }),
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
      }),
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
      }),
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
  test("page values are correct when window is undefined", () => {
    Object.defineProperty(globalThis, "window", {
      value: undefined,
    });
    const result = getHubspotNewsletterPayload({
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
    });
    expect(result).toEqual({
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
        pageUri: "",
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
      }),
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
      }),
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
describe("getHubspotOnboardingFormPayload", () => {
  test("uk teacher form payload is correct", () => {
    const result = getHubspotOnboardingFormPayload({
      hutk: "hubspotutk value 123",
      data: {
        email: "email value",
        newsletterSignUp: true,
        school: "999999-value",
        schoolName: "school_name value",
        oakUserId: "oak_user_id value",
        utm_campaign: "a campaign",
        utm_content: "some content",
        utm_medium: "some medium",
        utm_source: "a source",
        utm_term: "term",
      },
    });
    expect(result.fields).toEqual([
      { name: "contact_school_name", value: "school_name value" },
      { name: "contact_school_urn", value: "999999" },
      { name: "do_you_work_in_a_school", value: "Yes" },
      { name: "email", value: "email value" },
      { name: "email_consent_on_account_creation", value: "Yes" },
      { name: "latest_utm_campaign", value: "a campaign" },
      { name: "latest_utm_content", value: "some content" },
      { name: "latest_utm_medium", value: "some medium" },
      { name: "latest_utm_source", value: "a source" },
      { name: "latest_utm_term", value: "term" },
      { name: "oak_user_id", value: "oak_user_id value" },
    ]);
  });
  test("non-uk teacher form payload is correct", () => {
    const result = getHubspotOnboardingFormPayload({
      hutk: "hubspotutk value 123",
      data: {
        email: "email value",
        newsletterSignUp: true,
        schoolAddress: "123 plain lane",
        manualSchoolName: "Totally real school",
        oakUserId: "oak_user_id value",
        utm_campaign: "a campaign",
        utm_content: "some content",
        utm_medium: "some medium",
        utm_source: "a source",
        utm_term: "term",
      },
    });
    expect(result.fields).toEqual([
      { name: "contact_school_name", value: "Totally real school" },

      { name: "do_you_work_in_a_school", value: "Yes" },
      { name: "email", value: "email value" },
      { name: "email_consent_on_account_creation", value: "Yes" },
      { name: "latest_utm_campaign", value: "a campaign" },
      { name: "latest_utm_content", value: "some content" },
      { name: "latest_utm_medium", value: "some medium" },
      { name: "latest_utm_source", value: "a source" },
      { name: "latest_utm_term", value: "term" },
      { name: "manual_input_school_address", value: "123 plain lane" },
      { name: "oak_user_id", value: "oak_user_id value" },
    ]);
  });
  test("non-teacher form payload is correct", () => {
    const result = getHubspotOnboardingFormPayload({
      hutk: "hubspotutk value 123",
      data: {
        email: "email value",
        newsletterSignUp: true,
        role: "role value",
        other: "role_other value",
        oakUserId: "oak_user_id value",
        utm_campaign: "a campaign",
        utm_content: "some content",
        utm_medium: "some medium",
        utm_source: "a source",
        utm_term: "term",
      },
    });
    expect(result.fields).toEqual([
      { name: "contact_school_name", value: "notListed" },

      { name: "do_you_work_in_a_school", value: "No" },
      { name: "email", value: "email value" },
      { name: "email_consent_on_account_creation", value: "Yes" },
      { name: "latest_utm_campaign", value: "a campaign" },
      { name: "latest_utm_content", value: "some content" },
      { name: "latest_utm_medium", value: "some medium" },
      { name: "latest_utm_source", value: "a source" },
      { name: "latest_utm_term", value: "term" },

      { name: "non_school_role_description", value: "role value" },
      {
        name: "non_school_role_description_freetext",
        value: "role_other value",
      },
      { name: "oak_user_id", value: "oak_user_id value" },
    ]);
  });
  test("how can oak support you payload is correct", () => {
    const result = getHubspotOnboardingFormPayload({
      hutk: "hubspotutk value 123",
      data: {
        email: "email value",
        newsletterSignUp: true,
        role: "curriculumDesign",
        oakUserId: "oak_user_id value",
        utm_campaign: "a campaign",
        utm_content: "some content",
        utm_medium: "some medium",
        utm_source: "a source",
        utm_term: "term",
      },
    });
    expect(result.fields).toEqual([
      { name: "contact_school_name", value: "notListed" },
      { name: "do_you_work_in_a_school", value: "No" },
      { name: "email", value: "email value" },
      { name: "email_consent_on_account_creation", value: "Yes" },
      { name: "latest_utm_campaign", value: "a campaign" },
      { name: "latest_utm_content", value: "some content" },
      { name: "latest_utm_medium", value: "some medium" },
      { name: "latest_utm_source", value: "a source" },
      { name: "latest_utm_term", value: "term" },
      { name: "non_school_role_description", value: "curriculumDesign" },
      { name: "oak_user_id", value: "oak_user_id value" },
    ]);
  });
});
