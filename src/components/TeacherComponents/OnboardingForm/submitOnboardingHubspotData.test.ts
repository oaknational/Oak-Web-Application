import { submitOnboardingHubspotData } from "./submitOnboardingHubspotData";
import { SchoolSelectFormProps } from "./OnboardingForm.schema";

import { hubspotSubmitForm } from "@/browser-lib/hubspot/forms";
import { getHubspotOnboardingFormPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import OakError from "@/errors/OakError";

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

const submit = jest.fn();
const data: SchoolSelectFormProps = {
  school: "123",
  schoolName: "Test School",
  newsletterSignUp: true,
  onSubmit: submit,
};
const userSubscribed = true;
const posthogDistinctId = "posthogDistinctId";
const userEmail = "userEmail";

describe("submitHubspotData", () => {
  beforeEach(() => {
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
        email: "userEmail",
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
