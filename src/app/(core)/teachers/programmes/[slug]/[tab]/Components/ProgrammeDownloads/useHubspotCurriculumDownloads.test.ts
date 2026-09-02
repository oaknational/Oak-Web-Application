import { renderHook } from "@testing-library/react";

import { useHubspotCurriculumDownloads } from "./useHubspotCurriculumDownloads";

import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import OakError from "@/errors/OakError";

const mockHubspotSubmitForm = jest.fn();
jest.mock("@/browser-lib/hubspot/forms", () => ({
  hubspotSubmitForm: (props: unknown) => mockHubspotSubmitForm(props),
}));

jest.mock("@/hooks/useUtmParams", () => ({
  __esModule: true,
  default: () => ({ utm_source: "les_twitz" }),
}));

const mockGetHubspotUserToken = jest.fn(() => "hubspotutk value");
jest.mock("@/browser-lib/hubspot/forms/getHubspotUserToken", () => ({
  __esModule: true,
  default: () => mockGetHubspotUserToken(),
}));

const mockReportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default: () => (error: unknown) => mockReportError(error),
}));

const testPosthogDistinctId = "test-anonymous-id";

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    posthogDistinctId: testPosthogDistinctId,
  }),
}));

const data: ResourceFormValues & {
  phaseSlug: string;
  subjectSlug: string;
} = {
  email: "test@test.com",
  school: "222-Sample school",
  schoolName: "Sample school",
  terms: true,
  resources: ["curriculumPlan", "assessment"],
  phaseSlug: "primary",
  subjectSlug: "english",
};

describe("useHubspotCurriculumDownloads", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should attempt to get the hubspotutk cookie", async () => {
    const { result } = renderHook(() => useHubspotCurriculumDownloads());
    await result.current.onHubspotSubmit(data);

    expect(mockGetHubspotUserToken).toHaveBeenCalled();
  });

  it("should submit the correct curriculum downloads payload to hubspot", async () => {
    mockHubspotSubmitForm.mockResolvedValueOnce("ok");
    const { result } = renderHook(() => useHubspotCurriculumDownloads());
    const response = await result.current.onHubspotSubmit(data);

    expect(mockHubspotSubmitForm).toHaveBeenCalledWith({
      hubspotFormId: "NEXT_PUBLIC_HUBSPOT_CURRICULUM_DOWNLOADS_FORM_ID",
      payload: {
        fields: [
          { name: "contact_school_name", value: "Sample school" },
          { name: "contact_school_urn", value: "222" },
          {
            name: "curriculum_downloads_subject_phase_array",
            value: "english-primary",
          },
          {
            name: "curriculum_downloads_text_array",
            value: "english-primary-curriculumPlan;english-primary-assessment",
          },
          { name: "email", value: "test@test.com" },
          { name: "latest_utm_source", value: "les_twitz" },
          { name: "oak_user_id", value: testPosthogDistinctId },
        ],
        context: {
          hutk: "hubspotutk value",
          pageUri: "http://localhost/",
          pageName: "",
        },
      },
    });
    expect(response).toBe("ok");
  });

  it("should report an Oak Error when the source is generic", async () => {
    mockHubspotSubmitForm.mockRejectedValueOnce(new Error("test error"));
    const { result } = renderHook(() => useHubspotCurriculumDownloads());
    await result.current.onHubspotSubmit(data);

    expect(mockReportError).toHaveBeenCalledWith(
      new OakError({
        code: "hubspot/unknown",
        originalError: "test error",
      }),
    );
  });

  it("should report an Oak Error as it occurs", async () => {
    mockHubspotSubmitForm.mockRejectedValueOnce(
      new OakError({
        code: "hubspot/invalid-email",
      }),
    );
    const { result } = renderHook(() => useHubspotCurriculumDownloads());
    await result.current.onHubspotSubmit(data);

    expect(mockReportError).toHaveBeenCalledWith(
      new OakError({
        code: "hubspot/invalid-email",
      }),
    );
  });
});
