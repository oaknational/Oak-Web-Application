import { renderHook } from "@testing-library/react";

import { useHubspotCurriculumDownloads } from "./useHubspotCurriculumDownloads";

import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import OakError from "@/errors/OakError";

const mockHubspotSubmitForm = jest.fn();
jest.mock("@/browser-lib/hubspot/forms", () => ({
  hubspotSubmitForm: (props: unknown) => mockHubspotSubmitForm(props),
}));

jest.mock("@/browser-lib/getBrowserConfig", () => ({
  __esModule: true,
  default: (key: string) =>
    key === "hubspotCurriculumDownloadsFormId"
      ? "curriculum-downloads-form-id"
      : "",
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
  resources: ["docx", "full-curriculum"],
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
      hubspotFormId: "curriculum-downloads-form-id",
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
            value: "english-primary-docx;english-primary-full-curriculum",
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

  it("should use the school id as school name for homeschool or notListed", async () => {
    const { result } = renderHook(() => useHubspotCurriculumDownloads());
    await result.current.onHubspotSubmit({
      ...data,
      school: "notListed",
      schoolName: "Sample school",
    });

    expect(mockHubspotSubmitForm).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          fields: expect.arrayContaining([
            { name: "contact_school_name", value: "notListed" },
          ]),
        }),
      }),
    );

    const submitted = mockHubspotSubmitForm.mock.calls[0]?.[0] as {
      payload: { fields: Array<{ name: string }> };
    };
    expect(submitted.payload.fields).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "contact_school_urn" }),
      ]),
    );
  });

  it("should report an Oak Error when the source is generic", async () => {
    const originalError = new Error("test error");
    mockHubspotSubmitForm.mockRejectedValueOnce(originalError);
    const { result } = renderHook(() => useHubspotCurriculumDownloads());
    await result.current.onHubspotSubmit(data);

    expect(mockReportError).toHaveBeenCalledTimes(1);
    const reportedError = mockReportError.mock.calls[0]?.[0] as OakError;
    expect(reportedError).toBeInstanceOf(OakError);
    expect(reportedError.code).toBe("hubspot/unknown");
    expect(reportedError.originalError).toBe(originalError);
  });

  it("should report an Oak Error as it occurs", async () => {
    const oakError = new OakError({
      code: "hubspot/invalid-email",
    });
    mockHubspotSubmitForm.mockRejectedValueOnce(oakError);
    const { result } = renderHook(() => useHubspotCurriculumDownloads());
    await result.current.onHubspotSubmit(data);

    expect(mockReportError).toHaveBeenCalledWith(oakError);
  });
});
