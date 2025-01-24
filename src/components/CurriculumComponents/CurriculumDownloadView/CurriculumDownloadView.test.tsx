import { useUser } from "@clerk/nextjs";
import { act, waitFor } from "@testing-library/react";

import CurriculumDownloadView, { CurriculumDownloadViewData } from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(() => ({
    isLoaded: true,
    isSignedIn: false,
  })),
}));

jest.mock(
  "@/components/TeacherComponents/helpers/downloadAndShareHelpers/fetchHubspotContactDetails",
  () => ({
    fetchHubspotContactDetails: async () => {
      return {
        schoolId: "SCHOOL_ID",
        schoolName: "SCHOOL_NAME",
        email: "EMAIL",
      };
    },
  }),
);

describe("CurriculumDownloadView", () => {
  test("with data", async () => {
    const initialData: CurriculumDownloadViewData = {
      schoolId: undefined,
      schools: [
        {
          urn: "",
          la: "",
          name: "Test",
          postcode: "TEST",
          fullInfo: "test",
          status: "",
        },
      ],
      email: "test@example.com",
      downloadType: "word",
      schoolNotListed: true,
      termsAndConditions: true,
    } as const;
    const { getByTestId } = render(
      <CurriculumDownloadView
        data={initialData}
        schools={[]}
        isSubmitting={false}
      />,
    );
    const completeElement = getByTestId("details-completed");
    expect(completeElement).toContainHTML("My school isn’t listed");
    expect(completeElement).toContainHTML("test@example.com");
  });

  test("no data", async () => {
    const initialData: CurriculumDownloadViewData = {
      schoolId: undefined,
      schools: [
        {
          urn: "",
          la: "",
          name: "Test",
          postcode: "TEST",
          fullInfo: "test",
          status: "",
        },
      ],
      email: undefined,
      downloadType: "word",
      schoolNotListed: false,
      termsAndConditions: true,
    } as const;
    const { getByTestId } = render(
      <CurriculumDownloadView
        data={initialData}
        schools={[]}
        isSubmitting={false}
      />,
    );
    expect(getByTestId("download-school-isnt-listed")).toBeVisible();
    expect(getByTestId("download-email")).toBeVisible();
    expect(getByTestId("download-accept-terms")).toBeVisible();
  });

  test("logged in", async () => {
    (useUser as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });

    const onSubmit = jest.fn();

    const initialData: CurriculumDownloadViewData = {
      schoolId: undefined,
      schools: [
        {
          urn: "",
          la: "",
          name: "Test",
          postcode: "TEST",
          fullInfo: "test",
          status: "",
        },
      ],
      email: undefined,
      downloadType: "word",
      schoolNotListed: false,
      termsAndConditions: true,
    } as const;
    const { getByTestId } = render(
      <CurriculumDownloadView
        data={initialData}
        schools={[]}
        isSubmitting={false}
        onSubmit={onSubmit}
      />,
    );
    act(() => {
      getByTestId("download").click();
    });

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        downloadType: "word",
        email: "EMAIL",
        schoolId: "SCHOOL_ID-SCHOOL_NAME",
        schoolName: "SCHOOL_NAME",
        schoolNotListed: false,
        schools: [],
        termsAndConditions: true,
      });
    });
  });
});
