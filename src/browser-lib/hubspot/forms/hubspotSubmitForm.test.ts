import hubspotSubmitForm from "./hubspotSubmitForm";

const hubspotFallbackFormId = process.env.NEXT_PUBLIC_HUBSPOT_FALLBACK_FORM_ID;
const hubspotPortalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;
const hubspotFormId = "hubspot-test-form";
const fetch200 = async () => ({
  json: () => Promise.resolve({}),
  status: 200,
});
const fetch400 = async () => ({
  json: () => Promise.resolve({}),
  status: 400,
});
const fetch400InvalidEmail = async () => ({
  json: () =>
    Promise.resolve({
      errors: [{ errorType: "INVALID_EMAIL" }],
    }),
  status: 400,
});
const cookiesGet = (cookieName: string) => {
  if (cookieName === "hubspotutk") {
    return "hubspotutk value";
  }
};
const bugsnagNotify = async () => null;
const data = {
  email: "email value",
  full_name: "full_name value",
  user_type: "user_type value",
  oak_user_id: "oak_user_id value",
};
const primaryFormFetchExpectedArgs = [
  `https://hubspot-forms.thenational.academy/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFormId}`,
  {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: '{"fields":[{"name":"email","value":"email value"},{"name":"full_name","value":"full_name value"},{"name":"user_type","value":"user_type value"},{"name":"oak_user_id","value":"oak_user_id value"}],"context":{"hutk":"hubspotutk value","pageUri":"http://localhost/","pageName":""}}',
  },
];
const fallbackFormFetchExpectedArgs = [
  `https://hubspot-forms.thenational.academy/submissions/v3/integration/submit/${hubspotPortalId}/${hubspotFallbackFormId}`,
  {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: '{"fields":[{"name":"email_text_only","value":"email value"},{"name":"oak_user_id","value":"oak_user_id value"},{"name":"full_name","value":"full_name value"},{"name":"user_type","value":"user_type value"}],"context":{"hutk":"hubspotutk value","pageUri":"http://localhost/","pageName":""}}',
  },
];

describe("hubspotSubmitForm", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("succeeds", () => {
    beforeEach(() => {
      Cookies.get = jest.fn(cookiesGet);
      global.fetch = jest.fn(fetch200);
      Bugsnag.notify = jest.fn(bugsnagNotify);
    });
    it("should attempt to get the hubspotutk cookie", async () => {
      await hubspotSubmitForm({ hubspotFormId, data });

      expect(Cookies.get).toHaveBeenCalled();
    });
    it("should fetch the correct url with the correct payload", async () => {
      await hubspotSubmitForm({ hubspotFormId, data });

      expect(global.fetch).toHaveBeenCalledWith(
        ...primaryFormFetchExpectedArgs
      );
    });
    it("should succeed even if user doesn't have hubspot cookie", async () => {
      Cookies.get = jest.fn(() => undefined);
      await hubspotSubmitForm({ hubspotFormId, data });

      expect(global.fetch).toHaveBeenCalled();
    });
  });
  describe("fails with INVALID_EMAIL", () => {
    beforeEach(() => {
      Cookies.get = jest.fn(cookiesGet);
      // mock fetch to first respond with INVALID_EMAIL, then with a 200
      global.fetch = jest
        .fn(fetch200)
        .mockImplementationOnce(fetch400InvalidEmail);
    });
    it("should throw with the correct error message", async () => {
      let errorMessage = "";
      try {
        await hubspotSubmitForm({ hubspotFormId, data });
      } catch (error) {
        errorMessage = error.message;
      }

      expect(errorMessage).toBe(
        "Thank you, that's been received, but please check as your email doesn't look quite right."
      );
    });
    it("should submit data to the fallback form", async () => {
      try {
        await hubspotSubmitForm({ hubspotFormId, data });
      } catch (error) {
        //
      }
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        ...fallbackFormFetchExpectedArgs
      );
    });
    it("should not send error to bugsnag if fallback succeeds", async () => {
      try {
        await hubspotSubmitForm({ hubspotFormId, data });
      } catch (error) {
        //
      }

      expect(Bugsnag.notify).not.toHaveBeenCalled();
    });

    it("should send error to bugsnag if fallback fails", async () => {
      // mock fetch to first respond with INVALID_EMAIL, then with a generic 400
      global.fetch = jest
        .fn(fetch400)
        .mockImplementationOnce(fetch400InvalidEmail);
      try {
        await hubspotSubmitForm({ hubspotFormId, data });
      } catch (error) {
        //
      }

      expect(Bugsnag.notify).toHaveBeenNthCalledWith(
        1,
        "Failed to submit form to Hubspot, hubspot form id: hubspot-test-fallback-form. Error text: {}"
      );
    });
  });
  describe("fails with other error (not INVALID_EMAIL)", () => {
    beforeEach(() => {
      Cookies.get = jest.fn(cookiesGet);
      global.fetch = jest.fn(fetch400);
      Bugsnag.notify = jest.fn(bugsnagNotify);
    });
    it("should send error to bugsnag", async () => {
      try {
        await hubspotSubmitForm({ hubspotFormId, data });
      } catch (error) {
        //
      }
      expect(Bugsnag.notify).toHaveBeenCalledWith(
        "Failed to submit form to Hubspot, hubspot form id: hubspot-test-form. Error text: {}"
      );
    });
    it("should throw with the correct error message", async () => {
      let errorMessage = "";
      try {
        await hubspotSubmitForm({ hubspotFormId, data });
      } catch (error) {
        errorMessage = error.message;
      }
      expect(errorMessage).toBe(
        "Sorry, we couldn't sign you up just now, try again later."
      );
    });
    it("should only have called fetch once", async () => {
      try {
        await hubspotSubmitForm({ hubspotFormId, data });
      } catch (error) {
        //
      }
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
