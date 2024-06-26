import HeaderListingCurriculumDownloadButton from "./HeaderListingCurriculumDownloadButton";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("HeaderListingCurriculumDownloadButton", () => {
  test("renders a download button link with href corresponding to passed in props", () => {
    const { getByTestId } = render(
      <HeaderListingCurriculumDownloadButton
        keyStageSlug={"ks4"}
        subjectSlug={"english"}
      />,
    );
    const downloadLink = getByTestId("curriculum-downloads-link");
    expect(downloadLink).toHaveAttribute(
      "href",
      "/teachers/curriculum/previous-downloads?subject=english&keystage=ks4",
    );
  });
});
