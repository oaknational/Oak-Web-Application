import fetchMock from "jest-fetch-mock";

import {
  getSubscriptionStatus,
  onboardUser,
  onboardUserToHubspot,
} from "./onboardingActions";

import OakError from "@/errors/OakError";
import * as hubspotForms from "@/browser-lib/hubspot/forms";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import getHubspotUserToken from "@/browser-lib/hubspot/forms/getHubspotUserToken";
import { getHubspotOnboardingFormPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";

const reportError = jest.fn();

jest.mock("@/browser-lib/hubspot/forms");
jest.mock("@/common-lib/error-reporter", () => {
  return {
    __esModule: true,
    default: () => {
      return (...args: unknown[]) => reportError(...args);
    },
  };
});

describe(onboardUser, () => {
  beforeAll(() => {
    fetchMock.enableMocks();
    fetchMock.doMock(
      JSON.stringify({ owa: { isOnboarded: true, isTeacher: true } }),
    );
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it("makes a request to mark the user as onboarded", async () => {
    await onboardUser({ isTeacher: true });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching("/api/auth/onboarding"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTeacher: true }),
      }),
    );
  });

  describe("when successful", () => {
    it("returns the response JSON", async () => {
      await expect(onboardUser({ isTeacher: true })).resolves.toEqual({
        owa: {
          isOnboarded: true,
          isTeacher: true,
        },
      });
    });
  });

  describe("when there is an error response", () => {
    it("throws", async () => {
      fetchMock.doMock(async () => {
        return {
          status: 500,
          body: "Internal Server error",
        };
      });

      await expect(onboardUser({ isTeacher: true })).rejects.toEqual(
        expect.any(OakError),
      );
    });
  });
});

describe("getSubscriptionStatus", () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });
  afterAll(() => {
    fetchMock.disableMocks();
  });

  it("makes a request to get the subscription status", async () => {
    fetchMock.mockResponse(JSON.stringify(true));
    await getSubscriptionStatus("fakeEmail.com", jest.fn);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching("/api/hubspot/subscription"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "fakeEmail.com",
          subscriptionName: "School Support",
        }),
      }),
    );
  });
  it("calls the callback with the response JSON", async () => {
    fetchMock.mockResponse(JSON.stringify(true));
    const callback = jest.fn();
    await getSubscriptionStatus("fakeEmail.com", callback);
    expect(callback).toHaveBeenCalledWith(true);
  });
  it("throws an error if the response is not valid", async () => {
    fetchMock.mockResponse(JSON.stringify({}));
    await expect(
      getSubscriptionStatus("fakeEmail.com", jest.fn),
    ).rejects.toEqual(expect.any(OakError));
  });
});

describe(onboardUserToHubspot, () => {
  const hubspotData = {
    oakUserId: "123",
    newsletterSignUp: false,
    school: "Grange Hill",
  };

  beforeEach(() => {
    jest.spyOn(hubspotForms, "hubspotSubmitForm").mockResolvedValue(undefined);
  });

  it("submits the correct hubspot form", async () => {
    await onboardUserToHubspot(hubspotData);

    expect(jest.spyOn(hubspotForms, "hubspotSubmitForm")).toHaveBeenCalledWith({
      hubspotFormId: getBrowserConfig("hubspotOnboardingFormId"),
      payload: getHubspotOnboardingFormPayload({
        hutk: getHubspotUserToken(),
        data: hubspotData,
      }),
    });
  });

  it("reports OakErrors", async () => {
    reportError.mockReset();
    const oakError = new OakError({ code: "hubspot/not-loaded" });

    jest
      .spyOn(hubspotForms, "hubspotSubmitForm")
      .mockRejectedValueOnce(oakError);

    await onboardUserToHubspot(hubspotData);

    expect(reportError).toHaveBeenCalledWith(oakError);
  });

  it("wraps vanilla errors in OakError", async () => {
    reportError.mockReset();
    const error = new Error();

    jest.spyOn(hubspotForms, "hubspotSubmitForm").mockRejectedValueOnce(error);

    await onboardUserToHubspot(hubspotData);

    expect(reportError).toHaveBeenCalledWith(
      new OakError({
        code: "hubspot/unknown",
        originalError: error,
      }),
    );
  });
});
