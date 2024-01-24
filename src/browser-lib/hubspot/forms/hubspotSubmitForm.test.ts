import hubspotSubmitForm from "./hubspotSubmitForm";
import {
  getHubspotNewsletterPayload,
  NewsletterHubspotFormData,
} from "./getHubspotFormPayloads";

import {
  getFakeFetch,
  buildHubspotFetchMatcher as buildMatcher,
} from "@/__tests__/__helpers__/fakeFetch";

const hubspotFallbackFormId = process.env.NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID;
const hubspotPortalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
const hubspotFormId = "hubspot-test-form";
const primaryFormEndpoint = `https://hubspot-forms.thenational.academy/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`;
const fallbackFormEndpoint = `https://hubspot-forms.thenational.academy/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFallbackFormId}`;

const primaryFormSuccess = buildMatcher(primaryFormEndpoint, {
  status: 200,
  inlineMessage: "Thanks that worked the first time",
});
const fallbackFormSuccess = buildMatcher(fallbackFormEndpoint, {
  status: 200,
  inlineMessage: "Thanks, it worked in the fallback, but not the primary!",
});

const hubspotErrorFailure = buildMatcher(primaryFormEndpoint, {
  status: 400,
  errors: [{ errorType: "INPUT_TOO_LARGE" }],
});
const invalidEmailFailure = buildMatcher(primaryFormEndpoint, {
  status: 400,
  errors: [{ errorType: "INVALID_EMAIL" }],
});
const unknownErrorFailure = buildMatcher(primaryFormEndpoint, {
  status: 400,
  aSurpriseField: "bar error details",
});

// Cache the oringal fetch function
const originalFetch = global.fetch;

// Reset any runtime request handlers we may add during the tests.
afterEach(() => {
  global.fetch = originalFetch;
  jest.resetAllMocks();
});

// Disable API mocking after the tests are done.
afterAll(() => {
  global.fetch = originalFetch;
});

const getHubspotUserToken = jest.fn(() => "hubspotutk value");
jest.mock("./getHubspotUserToken", () => ({
  __esModule: true,
  default: (...args: []) => getHubspotUserToken(...args),
}));
const reportError = jest.fn();
jest.mock("../../../common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

const data: NewsletterHubspotFormData = {
  email: "email value",
  name: "full_name value",
  userRole: "Student",
  oakUserId: "oak_user_id value",
};

const payload = getHubspotNewsletterPayload({
  hutk: "hubspotutk value 456",
  data,
});

describe("hubspotSubmitForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("succeeds", () => {
    it("should fetch the correct url with the correct payload", async () => {
      global.fetch = getFakeFetch(
        primaryFormSuccess,
      ) as unknown as typeof fetch;

      const successMessage = await hubspotSubmitForm({
        hubspotFormId,
        payload,
      });

      expect(successMessage).toBe("Thanks that worked the first time");
    });
    it("should succeed even if user doesn't have hubspot cookie", async () => {
      global.fetch = getFakeFetch([primaryFormSuccess]);

      getHubspotUserToken.mockImplementationOnce(
        () => undefined as unknown as string,
      );
      const successMessage = await hubspotSubmitForm({
        hubspotFormId,
        payload,
      });

      expect(successMessage).toBe("Thanks that worked the first time");
    });
  });

  describe("primary form fails with INVALID_EMAIL", () => {
    it("should throw with the correct error message", async () => {
      global.fetch = getFakeFetch([invalidEmailFailure, fallbackFormSuccess]);

      let errorMessage = "";
      try {
        await hubspotSubmitForm({
          hubspotFormId,
          payload,
        });
      } catch (error) {
        // eslint-disable-next-line
        // @ts-ignore
        errorMessage = error.message;
      }

      expect(errorMessage).toBe(
        "Thank you, that's been received, but please check as your email doesn't look quite right.",
      );
    });

    it("should not report error if fallback succeeds", async () => {
      global.fetch = getFakeFetch([hubspotErrorFailure, fallbackFormSuccess]);
      try {
        await hubspotSubmitForm({ hubspotFormId, payload });
      } catch (error) {
        //
      }

      expect(reportError).not.toHaveBeenCalled();
    });

    it.skip("should report error if fallback fails", async () => {
      server.use(fallbackForm400UnknownError);
      try {
        await hubspotSubmitForm({ hubspotFormId, payload });
      } catch (error) {
        //
      }
      expect(reportError).toHaveBeenNthCalledWith(
        1,
        new Error("Sorry, we couldn't sign you up just now, try again later."),
        {
          payload: {
            context: {
              hutk: "hubspotutk value 456",
              pageName: "",
              pageUri: "http://localhost/",
            },
            fields: [
              { name: "email", value: "email value" },
              { name: "full_name", value: "full_name value" },
              { name: "oak_user_id", value: "oak_user_id value" },
              { name: "user_type", value: "Student" },
              { name: "emailTextOnly", value: "email value" },
            ],
          },
          props: {
            payload: {
              context: {
                hutk: "hubspotutk value 456",
                pageName: "",
                pageUri: "http://localhost/",
              },
              fields: [
                { name: "email", value: "email value" },
                { name: "full_name", value: "full_name value" },
                { name: "oak_user_id", value: "oak_user_id value" },
                { name: "user_type", value: "Student" },
                { name: "emailTextOnly", value: "email value" },
              ],
            },
            hubspotFormId: "NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID",
            isFallbackAttempt: true,
          },
          responseBody: unknownErrorData,
        },
      );
    });
  });

  describe.skip("primary form fails with other hubspot error (not INVALID_EMAIL)", () => {
    beforeEach(() => {
      server.use(primaryForm400HubspotError);
    });
    it("should send error to bugsnag including response details", async () => {
      try {
        await hubspotSubmitForm({ hubspotFormId, payload });
      } catch (error) {
        //
      }
      expect(reportError).toHaveBeenCalledWith(
        new Error("Sorry, we couldn't sign you up just now, try again later."),
        {
          payload: {
            context: {
              hutk: "hubspotutk value 456",
              pageName: "",
              pageUri: "http://localhost/",
            },
            fields: [
              { name: "email", value: "email value" },
              { name: "full_name", value: "full_name value" },
              { name: "oak_user_id", value: "oak_user_id value" },
              { name: "user_type", value: "Student" },
            ],
          },
          props: {
            payload: {
              context: {
                hutk: "hubspotutk value 456",
                pageName: "",
                pageUri: "http://localhost/",
              },
              fields: [
                { name: "email", value: "email value" },
                { name: "full_name", value: "full_name value" },
                { name: "oak_user_id", value: "oak_user_id value" },
                { name: "user_type", value: "Student" },
              ],
            },
            hubspotFormId: "hubspot-test-form",
          },
          hubspotError: hubspotErrorData,
          responseBody: hubspotErrorData,
          isInvalidEmail: false,
        },
      );
    });
    it("should throw with the correct error message", async () => {
      let errorMessage = "";
      try {
        await hubspotSubmitForm({ hubspotFormId, payload });
      } catch (error) {
        // eslint-disable-next-line
        // @ts-ignore
        errorMessage = error.message;
      }
      expect(errorMessage).toBe(
        "Sorry, we couldn't sign you up just now, try again later.",
      );
    });
  });

  describe.skip("Primary form fails with INVALID_EMAIL and fallback form fails too", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
      // mock fetch to first respond with INVALID_EMAIL, then with a 400
      server.use(primaryForm400InvalidEmail, fallbackForm400HubspotError);
    });
    test("error should be reported", async () => {
      /**
       * @todo we should mark reported errors as "notified" to avoid them
       * being re-reported
       */
      try {
        await hubspotSubmitForm({ hubspotFormId, payload });
      } catch (error) {
        //
      }
      expect(reportError).toHaveBeenCalled();
    });
  });

  describe.skip("Hubspot responds with unexpected response (e.g. their api has changed)", () => {
    beforeEach(() => {
      server.use(primaryForm400UnknownError);
    });
    test("error is thrown with correct message", async () => {
      let errorMessage = "";
      try {
        await hubspotSubmitForm({ hubspotFormId, payload });
      } catch (error) {
        // eslint-disable-next-line
        // @ts-ignore
        errorMessage = error.message;
      }
      expect(errorMessage).toBe(
        "Sorry, we couldn't sign you up just now, try again later.",
      );
    });
    test("error is reported", async () => {
      try {
        await hubspotSubmitForm({ hubspotFormId, payload });
      } catch (error) {
        //
      }

      expect(reportError).toHaveBeenCalled();
    });
  });

  describe.skip("Network error", () => {
    beforeEach(() => {
      server.use(
        rest.post(primaryFormEndpoint, (req, res) =>
          // DEBUG this is now resulting in an OakError, so the following tests fail.
          res.networkError("Failed to connect"),
        ),
      );
    });
    test("user is displayed correct message", async () => {
      let errorMessage = "";
      try {
        await hubspotSubmitForm({ hubspotFormId, payload });
      } catch (error) {
        // eslint-disable-next-line
        // @ts-ignore
        errorMessage = error.message;
      }
      expect(errorMessage).toBe("Failed to connect.");
    });
  });
});
