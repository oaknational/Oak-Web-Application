import HeaderListing, { HeaderListingProps } from "./HeaderListing";
import { headerListingProps } from "./HeaderListing.stories";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const curriculumMapDownloaded = jest.fn();
jest.mock("../../context/Analytics/useAnalytics", () => ({
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

  it("renders the curriculum download button", () => {
    const { queryAllByText } = renderWithTheme(<HeaderListing {...props} />);
    const downloadLink = queryAllByText("Curriculum download (PDF)");

    expect(downloadLink[0]).toBeInTheDocument();
  });

  it("renders key stage title when passed in ", () => {
    const { getAllByText } = renderWithTheme(<HeaderListing {...props} />);
    const year = getAllByText("Key Stage 4");
    expect(year).toHaveLength(2); // mobile and desktop
  });
});
