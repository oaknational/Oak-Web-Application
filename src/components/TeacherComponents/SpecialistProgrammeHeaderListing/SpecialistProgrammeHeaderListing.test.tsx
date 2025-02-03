import SpecialistProgrammeHeaderListing from "./SpecialistProgrammeHeaderListing";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const curriculumMapDownloaded = vi.fn();
vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumMapDownloaded: (...args: unknown[]) =>
        curriculumMapDownloaded(...args),
    },
  }),
}));

const props = {
  title: "Specialist & therapies",
  breadcrumbs: [],
  description:
    "Help your pupils with their communication and language development, including sentence composition, writing and word reading skills by exploring topics including holidays and the seasons.",
  hasCurriculumDownload: true,
  subjectSlug: "maths",
  subjectTitle: "Communication and Language",
};

describe("SpecialistProgrammeHeaderListing", () => {
  it("renders the subject heading with the correct level", () => {
    const { getAllByRole } = renderWithTheme(
      <SpecialistProgrammeHeaderListing {...props} />,
    );
    const subjectHeading = getAllByRole("heading", { level: 1 });
    expect(subjectHeading).toHaveLength(1);
    expect(subjectHeading[0]).toHaveTextContent("Communication and Language");
  });
  it("renders the title", () => {
    const { getByText } = renderWithTheme(
      <SpecialistProgrammeHeaderListing {...props} />,
    );
    const title = getByText(props.title);
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(props.title);
  });

  it("renders the description", () => {
    const { getByText } = renderWithTheme(
      <SpecialistProgrammeHeaderListing {...props} />,
    );
    const description = getByText(props.description);
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(props.description);
  });

  /*  - I want to be able to download specialist curriculum maps LESQ-586 */
  it.skip("renders the curriculum download button", () => {
    const { queryAllByText } = renderWithTheme(
      <SpecialistProgrammeHeaderListing {...props} />,
    );
    const downloadLink = queryAllByText("Curriculum download (PDF)");

    expect(downloadLink[0]).toBeInTheDocument();
  });
});
