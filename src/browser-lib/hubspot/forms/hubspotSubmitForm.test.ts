import { rest } from "msw";
import { setupServer } from "msw/node";

import hubspotSubmitForm from "./hubspotSubmitForm";
import getHubspotNewsletterPayload, {
  NewsletterHubspotFormData,
} from "./getHubspotNewsletterFormPayload";

const hubspotFallbackFormId = process.env.NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID;
const hubspotPortalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
const hubspotFormId = "hubspot-test-form";

const primaryFormEndpoint = `https://hubspot-forms.thenational.academy/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`;
const fallbackFormEndpoint = `https://hubspot-forms.thenational.academy/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFallbackFormId}`;
const formHandler =
  (url: string) => (status: number, data: Record<string, unknown>) =>
    rest.post(url, (req, res, ctx) => res(ctx.status(status), ctx.json(data)));

const primaryForm = formHandler(primaryFormEndpoint);
const fallbackForm = formHandler(fallbackFormEndpoint);

const hubspotErrorData = { errors: [{ errorType: "INPUT_TOO_LARGE" }] };
const invalidEmailData = { errors: [{ errorType: "INVALID_EMAIL" }] };
const unknownErrorData = { foo: "bar error details" };

const primaryForm200 = primaryForm(200, {
  inlineMessage: "Thanks that worked the first time",
});
const primaryForm400InvalidEmail = primaryForm(400, invalidEmailData);
const primaryForm400UnknownError = primaryForm(400, unknownErrorData);
const primaryForm400HubspotError = primaryForm(400, hubspotErrorData);

const fallbackForm200 = fallbackForm(200, {
  inlineMessage: "Thanks, it worked in the fallback, but not the primary!",
});
const fallbackForm400HubspotError = fallbackForm(400, hubspotErrorData);
const fallbackForm400UnknownError = fallbackForm(400, unknownErrorData);

const server = setupServer(primaryForm200, fallbackForm200);

// Enable API mocking before tests.
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

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
      const successMessage = await hubspotSubmitForm({
        hubspotFormId,
        payload,
      });

      expect(successMessage).toBe("Thanks that worked the first time");
    });
    it("should succeed even if user doesn't have hubspot cookie", async () => {
      getHubspotUserToken.mockImplementationOnce(
        () => undefined as unknown as string
      );
      const successMessage = await hubspotSubmitForm({
        hubspotFormId,
        payload,
      });

      expect(successMessage).toBe("Thanks that worked the first time");
    });
  });
  describe("primary form fails with INVALID_EMAIL", () => {
    beforeEach(() => {
      server.use(primaryForm400InvalidEmail);
    });

    it("should throw with the correct error message", async () => {
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
        "Thank you, that's been received, but please check as your email doesn't look quite right."
      );
    });
    it("should not report error if fallback succeeds", async () => {
      try {
        await hubspotSubmitForm({ hubspotFormId, payload });
      } catch (error) {
        //
      }

      expect(reportError).not.toHaveBeenCalled();
    });
    it("should report error if fallback fails", async () => {
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
        }
      );
    });
  });
  describe("primary form fails with other hubspot error (not INVALID_EMAIL)", () => {
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
        }
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
        "Sorry, we couldn't sign you up just now, try again later."
      );
    });
    it.skip("should only have called fetch once", async () => {
      /**
       * @todo hard to test this msw, and they specifically advise against it
       * @see https://mswjs.io/docs/recipes/request-assertions
       */
      try {
        await hubspotSubmitForm({ hubspotFormId, payload });
      } catch (error) {
        //
      }
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
  describe("Primary form fails with INVALID_EMAIL and fallback form fails too", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
      // mock fetch to first respond with INVALID_EMAIL, then with a 400
      server.use(primaryForm400InvalidEmail, fallbackForm400HubspotError);
    });
    test.skip("error should only be reported once", async () => {
      /**
       * @todo we should mark reported errors as "notified" to avoid them
       * being re-reported
       */
      try {
        await hubspotSubmitForm({ hubspotFormId, payload });
      } catch (error) {
        //
      }
      expect(reportError).toHaveBeenCalledTimes(1);
    });
  });
  describe("Hubspot responds with unexpected response (e.g. their api has changed)", () => {
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
        "Sorry, we couldn't sign you up just now, try again later."
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
  describe("Network error", () => {
    beforeEach(() => {
      server.use(
        rest.post(primaryFormEndpoint, (req, res) =>
          res.networkError("Failed to connect")
        )
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
    test("error is not reported", async () => {
      try {
        await hubspotSubmitForm({ hubspotFormId, payload });
      } catch (error) {
        //
      }

      expect(reportError).not.toHaveBeenCalled();
    });
  });
});
