import HeaderListing, { HeaderListingProps } from "./HeaderListing";
import { headerListingProps } from "./HeaderListing.stories";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const curriculumMapDownloaded = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumMapDownloaded: (...args: unknown[]) =>
        curriculumMapDownloaded(...args),
    },
  }),
}));

const props = headerListingProps as unknown as HeaderListingProps;

describe("HeaderListing", () => {
  it("renders the title with the correct level", () => {
    const { getAllByRole } = renderWithTheme(<HeaderListing {...props} />);
    const subjectHeading = getAllByRole("heading", { level: 1 });
    expect(subjectHeading).toHaveLength(1);
    expect(subjectHeading[0]).toHaveTextContent("English");
  });

  it("renders the curriculum download buttons by default", () => {
    const { queryAllByTestId } = renderWithTheme(<HeaderListing {...props} />);
    const downloadLinks = queryAllByTestId("curriculum-download-link");
    expect(downloadLinks).toHaveLength(2);
  });

  it("does not renders the curriculum download button when no download is available", () => {
    const { queryAllByTestId } = renderWithTheme(
      <HeaderListing hasCurriculumDownload={false} {...props} />,
    );
    const downloadLinks = queryAllByTestId("curriculum-download-link");
    expect(downloadLinks).toHaveLength(0);
  });

  it("renders the curriculum download button when key stages are available", () => {
    const { queryAllByTestId } = renderWithTheme(
      <HeaderListing
        keyStageSlug={"ks1"}
        keyStageTitle={"Key Stage 1"}
        {...props}
      />,
    );
    const downloadLinks = queryAllByTestId("curriculum-download-link");
    expect(downloadLinks).toHaveLength(2);
  });
});
