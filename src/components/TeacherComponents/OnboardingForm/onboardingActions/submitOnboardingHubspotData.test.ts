import { Mock, vi } from "vitest";

import { SchoolSelectFormProps } from "../OnboardingForm.schema";

import { submitOnboardingHubspotData } from "./submitOnboardingHubspotData";

import { getHubspotOnboardingFormPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import * as hubspotForms from "@/browser-lib/hubspot/forms";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import getHubspotUserToken from "@/browser-lib/hubspot/forms/getHubspotUserToken";
import OakError from "@/errors/OakError";

vi.mock("@/browser-lib/hubspot/forms");
vi.mock("@/browser-lib/hubspot/forms/getHubspotFormPayloads");
const reportError = vi.fn();
vi.mock("@/common-lib/error-reporter", () => ({
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
const submit = vi.fn();
const data: SchoolSelectFormProps = {
  school: "123",
  schoolName: "Test School",
  newsletterSignUp: true,
  onSubmit: submit,
};
const userEmail = "test@example.com";
const userSubscribed = true;
const posthogDistinctId = "posthogDistinctId";

describe("submitHubspotData", () => {
  const hubspotData = {
    oakUserId: "123",
    newsletterSignUp: false,
    school: "Grange Hill",
  };
  beforeEach(() => {
    vi.spyOn(hubspotForms, "hubspotSubmitForm").mockResolvedValue(undefined);
    vi.clearAllMocks();
    vi.resetModules();
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

    expect(vi.spyOn(hubspotForms, "hubspotSubmitForm")).toHaveBeenCalledWith({
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

    vi.spyOn(hubspotForms, "hubspotSubmitForm").mockRejectedValueOnce(oakError);

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

    expect(vi.spyOn(hubspotForms, "hubspotSubmitForm")).toHaveBeenCalledWith({
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

    vi.spyOn(hubspotForms, "hubspotSubmitForm").mockRejectedValueOnce(error);

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
    (hubspotForms.hubspotSubmitForm as Mock).mockRejectedValue(
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
