import fetchMock from "jest-fetch-mock";

import useLocalStorageForDownloads from "../hooks/downloadAndShareHooks/useLocalStorageForDownloads";

import {
  getSubscriptionStatus,
  onboardUser,
  setOnboardingLocalStorage,
  submitOnboardingHubspotData,
} from "./onboardingActions";
import { SchoolSelectFormProps } from "./OnboardingForm.schema";

import * as hubspotForms from "@/browser-lib/hubspot/forms";
import OakError from "@/errors/OakError";
import { getHubspotOnboardingFormPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import { hubspotSubmitForm } from "@/browser-lib/hubspot/forms";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import getHubspotUserToken from "@/browser-lib/hubspot/forms/getHubspotUserToken";

jest.mock("@/browser-lib/hubspot/forms");
jest.mock("@/browser-lib/hubspot/forms/getHubspotFormPayloads");
const reportError = jest.fn();
jest.mock("../../../common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: []) =>
      reportError(...args),
}));

const hutk = "hutk";
const utmParams = {
  utm_source: "utm_source",
  utm_medium: "utm_medium",
  utm_campaign: "utm_campaign",
  utm_term: "utm_term",
  utm_content: "utm_content",
};

const mockLocalStorageForDownloads = {
  setSchoolInLocalStorage: jest.fn(),
  setEmailInLocalStorage: jest.fn(),
  setTermsInLocalStorage: jest.fn(),
} as unknown as ReturnType<typeof useLocalStorageForDownloads>;
const submit = jest.fn();
const data: SchoolSelectFormProps = {
  school: "123",
  schoolName: "Test School",
  newsletterSignUp: true,
  onSubmit: submit,
};
const dataManual: SchoolSelectFormProps = {
  schoolAddress: "address",
  manualSchoolName: "Manual Test School",
  newsletterSignUp: true,
  onSubmit: submit,
};

const userEmail = "test@example.com";
const userSubscribed = true;
const posthogDistinctId = "posthogDistinctId";

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
describe("setOnboardingLocalStorage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should set school in local storage when data contains school", () => {
    setOnboardingLocalStorage({
      localStorageForDownloads: mockLocalStorageForDownloads,
      data,
      userEmail,
      userSubscribed,
    });

    expect(
      mockLocalStorageForDownloads.setSchoolInLocalStorage,
    ).toHaveBeenCalledWith({
      schoolName: "Test School",
      schoolId: "123",
    });
  });

  it("should set school in local storage when data contains manualSchoolName", () => {
    setOnboardingLocalStorage({
      localStorageForDownloads: mockLocalStorageForDownloads,
      data: dataManual,
      userEmail,
      userSubscribed,
    });

    expect(
      mockLocalStorageForDownloads.setSchoolInLocalStorage,
    ).toHaveBeenCalledWith({
      schoolName: "Manual Test School",
      schoolId: "Manual Test School",
    });
  });

  it("should set email in local storage when userEmail is provided and user is subscribed", () => {
    setOnboardingLocalStorage({
      localStorageForDownloads: mockLocalStorageForDownloads,
      data: { ...data, manualSchoolName: "Manual Test School" },
      userEmail,
      userSubscribed: true,
    });

    expect(
      mockLocalStorageForDownloads.setEmailInLocalStorage,
    ).toHaveBeenCalledWith(userEmail);
  });

  it("should set email to empty string in local storage when userSubscribed is false", () => {
    setOnboardingLocalStorage({
      localStorageForDownloads: mockLocalStorageForDownloads,
      data: { ...data, manualSchoolName: "Manual Test School" },
      userEmail,
      userSubscribed: false,
    });

    expect(
      mockLocalStorageForDownloads.setEmailInLocalStorage,
    ).toHaveBeenCalledWith("");
  });

  it("should set terms in local storage", () => {
    setOnboardingLocalStorage({
      localStorageForDownloads: mockLocalStorageForDownloads,
      data: { ...data, manualSchoolName: "Manual Test School" },
      userEmail,
      userSubscribed: true,
    });
    expect(
      mockLocalStorageForDownloads.setTermsInLocalStorage,
    ).toHaveBeenCalledWith(true);
  });
});

describe("submitHubspotData", () => {
  const hubspotData = {
    oakUserId: "123",
    newsletterSignUp: false,
    school: "Grange Hill",
  };
  beforeEach(() => {
    jest.spyOn(hubspotForms, "hubspotSubmitForm").mockResolvedValue(undefined);
    jest.clearAllMocks();
    jest.resetModules();
  });
  test("should call getHubspotOnboardingFormPayload with the correct values", async () => {
    await submitOnboardingHubspotData({
      hutk,
      utmParams,
      data,
      userSubscribed,
      posthogDistinctId,
      userEmail,
    });

    expect(getHubspotOnboardingFormPayload).toHaveBeenCalledWith({
      hutk,
      data: {
        email: "test@example.com",
        newsletterSignUp: true,
        oakUserId: "posthogDistinctId",
        role: "",
        onSubmit: submit,
        schoolName: "Test School",
        school: "123",
        utm_campaign: "utm_campaign",
        utm_content: "utm_content",
        utm_medium: "utm_medium",
        utm_source: "utm_source",
        utm_term: "utm_term",
      },
    });
  });
  it("submits the correct hubspot form", async () => {
    await submitOnboardingHubspotData({
      hutk,
      utmParams,
      data,
      userSubscribed,
      posthogDistinctId,
      userEmail,
    });

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

    await submitOnboardingHubspotData({
      hutk,
      utmParams,
      data,
      userSubscribed,
      posthogDistinctId,
      userEmail,
    });

    expect(reportError).toHaveBeenCalledWith(oakError);
  });

  it("submits the correct hubspot form", async () => {
    await submitOnboardingHubspotData({
      hutk,
      utmParams,
      data,
      userSubscribed,
      posthogDistinctId,
      userEmail,
    });

    expect(jest.spyOn(hubspotForms, "hubspotSubmitForm")).toHaveBeenCalledWith({
      hubspotFormId: getBrowserConfig("hubspotOnboardingFormId"),
      payload: getHubspotOnboardingFormPayload({
        hutk: getHubspotUserToken(),
        data: hubspotData,
      }),
    });
  });

  it("wraps vanilla errors in OakError", async () => {
    reportError.mockReset();
    const error = new Error();

    jest.spyOn(hubspotForms, "hubspotSubmitForm").mockRejectedValueOnce(error);

    await submitOnboardingHubspotData({
      hutk,
      utmParams,
      data,
      userSubscribed,
      posthogDistinctId,
      userEmail,
    });

    expect(reportError).toHaveBeenCalledWith(
      new OakError({
        code: "hubspot/unknown",
        originalError: error,
      }),
    );
  });

  test("should throw and report error if failed to submit to hubspot", async () => {
    (hubspotSubmitForm as jest.Mock).mockRejectedValue(
      new OakError({ code: "hubspot/unknown" }),
    );

    await submitOnboardingHubspotData({
      hutk,
      utmParams,
      data,
      userSubscribed,
      posthogDistinctId,
      userEmail,
    });

    expect(reportError).toHaveBeenCalled();
  });
});
