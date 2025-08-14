import { useUser } from "@clerk/nextjs";
import { act, screen, waitFor } from "@testing-library/react";

import CurriculumDownloadView, { CurriculumDownloadViewData } from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { DISABLE_DOWNLOADS } from "@/utils/curriculum/constants";

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
  if (DISABLE_DOWNLOADS) {
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
      const { baseElement } = render(
        <CurriculumDownloadView
          data={initialData}
          schools={[]}
          isSubmitting={false}
        />,
      );
      expect(baseElement).toHaveTextContent(
        "won't be able to download curriculum documents right now",
      );
    });
  }
  if (!DISABLE_DOWNLOADS) {
    test("renders details completed when school and email are supplied and terms accepted", async () => {
      const initialData: CurriculumDownloadViewData = {
        schoolId: "URN-Test",
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
        schoolNotListed: false,
        schoolName: "Test School",
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
      expect(completeElement).toContainHTML("Test School");
      expect(completeElement).toContainHTML("test@example.com");
    });

    test("submits when school not listed and email is supplied", async () => {
      const initialData: CurriculumDownloadViewData = {
        schoolId: undefined,
        schools: [],
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
    });

    test("submits when school not listed and no email is supplied", async () => {
      const initialData: CurriculumDownloadViewData = {
        schoolId: undefined,
        schools: [],
        email: undefined,
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
      // The below assertion refers to the email field
      expect(completeElement).toContainHTML("Not provided");
    });

    test("does not submit when terms are not accepted", async () => {
      const onSubmit = jest.fn();
      const initialData: CurriculumDownloadViewData = {
        schoolId: undefined,
        schools: [],
        email: "test@example.com",
        downloadType: "word",
        schoolNotListed: true,
        termsAndConditions: false,
      } as const;
      const { getByRole } = render(
        <CurriculumDownloadView
          data={initialData}
          schools={[]}
          isSubmitting={false}
          onSubmit={onSubmit}
        />,
      );

      act(() => {
        getByRole("button", { name: /download/i }).click();
      });

      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled();
        const errors = screen.getAllByText(
          "Accept terms and conditions to continue",
        );
        expect(errors.length).toBeGreaterThanOrEqual(1);
        expect(errors[0]).toBeVisible();
      });
    });

    test("requires input when no data is provided", async () => {
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
      expect(
        screen.getByPlaceholderText("Type your email address"),
      ).toBeVisible();
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
  }
});
