import { OaksImpactCaseStudies } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("OaksImpactCaseStudies", () => {
  it("renders correctly", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <OaksImpactCaseStudies 
        caseStudies={[
          {
            heading: "Case study 1",
            href: "#",
            imageSrc: "https://res.cloudinary.com/oak-web-application/image/upload/v1698336490/sample.jpg",
          },
          {
            heading: "Case study 2",
            href: "#",
            imageSrc: "https://res.cloudinary.com/oak-web-application/image/upload/v1698336490/sample.jpg",
          },
          {
            heading: "Case study 3",
            href: "#",
            imageSrc: "https://res.cloudinary.com/oak-web-application/image/upload/v1698336490/sample.jpg",
          },
        ]}
      />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { name: "Case studies" })).toBeInTheDocument();

    const links = getAllByRole("link", { name: "Watch the video" });
    expect(links).toHaveLength(3);

    const caseStudyHeadings = getAllByRole("heading", { level: 3 });
    expect(caseStudyHeadings).toHaveLength(3);

    const images = getAllByRole("img");
    expect(images).toHaveLength(3);
  });
});
