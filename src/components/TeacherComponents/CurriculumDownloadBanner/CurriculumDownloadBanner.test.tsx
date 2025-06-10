import { screen } from "@testing-library/dom";

import CurriculumDownloadBanner from "./CurriculumDownloadBanner";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();
describe("CurriculumDownloadBanner", () => {
  it("renders correctly when hasCycle2Content is true", () => {
    render(
      <CurriculumDownloadBanner
        hasCycle2Content={true}
        subjectSlug="maths"
        subjectTitle="Maths"
        phase="primary"
      />,
    );

    const heading = screen.getByRole("heading", {
      name: "Fully resourced maths curriculum is coming this autumn.",
    });
    expect(heading).toBeInTheDocument();
    const downloadButton = screen.getByRole("button", {
      name: "Download curriculum plan",
    });
    expect(downloadButton).toBeInTheDocument();
  });
  it("does not render when hasCycle2Content is false", () => {
    render(
      <CurriculumDownloadBanner
        hasCycle2Content={false}
        subjectSlug="maths"
        subjectTitle="Maths"
        phase="primary"
      />,
    );
    const heading = screen.queryByRole("heading", {
      name: "Fully resourced maths curriculum is coming this autumn.",
    });
    expect(heading).not.toBeInTheDocument();
  });
});
