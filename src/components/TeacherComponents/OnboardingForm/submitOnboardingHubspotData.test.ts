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
const data = {
  schoolName: "schoolName",
  role: "role",
  phase: "phase",
  subject: "subject",
  newsletterSignUp: true,
} as unknown as SchoolSelectFormProps;
const userSubscribedInHubspot = true;
const posthogDistinctId = "posthogDistinctId";
const userEmail = "userEmail";

describe("submitHubspotData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  test("should call getHubspotOnboardingFormPayload with the correct values", async () => {
    await submitOnboardingHubspotData(
      hutk,
      utmParams,
      data,
      userSubscribedInHubspot,
      posthogDistinctId,
      userEmail,
    );

    expect(getHubspotOnboardingFormPayload).toHaveBeenCalledWith({
      hutk,
      data: {
        email: "userEmail",
        newsletterSignUp: true,
        oakUserId: "posthogDistinctId",
        phase: "phase",
        role: "role",
        schoolName: "schoolName",
        subject: "subject",
        utm_campaign: "utm_campaign",
        utm_content: "utm_content",
        utm_medium: "utm_medium",
        utm_source: "utm_source",
        utm_term: "utm_term",
      },
    });
  });
  test("should call getHubspotOnboardingFormPayload with the correct values", async () => {
    await submitOnboardingHubspotData(
      hutk,
      utmParams,
      data,
      userSubscribedInHubspot,
      posthogDistinctId,
      userEmail,
    );

    expect(hubspotSubmitForm).toHaveBeenCalled();
  });
  test("should set email to userEmail if userSubscribedInHubspot is true", async () => {
    const userSubscribedInHubspot = true;
    const data = { newsletterSignUp: false } as SchoolSelectFormProps;

    await submitOnboardingHubspotData(
      hutk,
      utmParams,
      data,
      userSubscribedInHubspot,
      posthogDistinctId,
      userEmail,
    );

    expect(getHubspotOnboardingFormPayload).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: userEmail,
        }),
      }),
    );
  });

  test("should set email to userEmail if data.newsletterSignUp is true", async () => {
    const userSubscribedInHubspot = false;
    const data = { newsletterSignUp: true } as SchoolSelectFormProps;

    await submitOnboardingHubspotData(
      hutk,
      utmParams,
      data,
      userSubscribedInHubspot,
      posthogDistinctId,
      userEmail,
    );

    expect(getHubspotOnboardingFormPayload).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: userEmail,
        }),
      }),
    );
  });
  test("should set newsletterSignUp to true if userSubscribedInHubspot is true", async () => {
    const userSubscribedInHubspot = true;
    const data = { newsletterSignUp: false } as SchoolSelectFormProps;

    await submitOnboardingHubspotData(
      hutk,
      utmParams,
      data,
      userSubscribedInHubspot,
      posthogDistinctId,
      userEmail,
    );

    expect(getHubspotOnboardingFormPayload).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          newsletterSignUp: true,
        }),
      }),
    );
  });

  test("should use data.newsletterSignUp when userSubscribedInHubspot is false", async () => {
    const userSubscribedInHubspot = false;
    const data = { newsletterSignUp: true } as SchoolSelectFormProps;

    await submitOnboardingHubspotData(
      hutk,
      utmParams,
      data,
      userSubscribedInHubspot,
      posthogDistinctId,
      userEmail,
    );

    expect(getHubspotOnboardingFormPayload).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          newsletterSignUp: true,
        }),
      }),
    );
  });

  test("should set newsletterSignUp to false if both userSubscribedInHubspot and data.newsletterSignUp are false", async () => {
    const userSubscribedInHubspot = false;
    const data = { newsletterSignUp: false } as SchoolSelectFormProps;

    await submitOnboardingHubspotData(
      hutk,
      utmParams,
      data,
      userSubscribedInHubspot,
      posthogDistinctId,
      userEmail,
    );

    expect(getHubspotOnboardingFormPayload).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          newsletterSignUp: false,
        }),
      }),
    );
  });

  test("should set email to undefined if both userSubscribedInHubspot and data.newsletterSignUp are false", async () => {
    const userSubscribedInHubspot = false;
    const data = { newsletterSignUp: false } as SchoolSelectFormProps;

    await submitOnboardingHubspotData(
      hutk,
      utmParams,
      data,
      userSubscribedInHubspot,
      posthogDistinctId,
      userEmail,
    );

    expect(getHubspotOnboardingFormPayload).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: undefined,
        }),
      }),
    );
  });
  test("should throw and report error if failed to submit to hubspot", async () => {
    (hubspotSubmitForm as jest.Mock).mockRejectedValue(
      new OakError({ code: "hubspot/unknown" }),
    );

    await submitOnboardingHubspotData(
      hutk,
      utmParams,
      data,
      userSubscribedInHubspot,
      posthogDistinctId,
      userEmail,
    );

    expect(reportError).toHaveBeenCalled();
  });
});
