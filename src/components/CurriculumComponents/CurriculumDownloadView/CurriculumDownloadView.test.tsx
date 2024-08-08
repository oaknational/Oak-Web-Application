import CurriculumDownloadView, { CurriculumDownloadViewData } from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

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
});
