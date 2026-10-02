import { caseStudiesSectionFixture } from "./CaseStudiesSection.fixtures";

import { CaseStudiesSection } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CaseStudiesSection", () => {
  it("renders correctly when 3 case studies are provided", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={caseStudiesSectionFixture}
      />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { name: "Case studies" })).toBeInTheDocument();
    expect(getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders correctly when 2 case studies are provided", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={caseStudiesSectionFixture.slice(0, 2)}
      />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { name: "Case studies" })).toBeInTheDocument();
    expect(getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders only the first 3 case studies when more are provided", () => {
    const caseStudiesWithFourth = [
      ...caseStudiesSectionFixture,
      {
        video: {
          title: "Case study 4",
        },
        slug: {
          current: "case-study-4",
        },
        image: {
          asset: {
            _id: "id-4",
            url: "https://res.cloudinary.com/oak-web-application/image/upload/v1698336494/samples/food/spices.jpg",
          },
        },
        text: "Some text about case study 4",
      },
    ];

    const { getAllByRole } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={caseStudiesWithFourth}
      />,
    );

    expect(getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders 'Watch the video' link when the case study contains a video and showTags is false", () => {
    const { getAllByText } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={caseStudiesSectionFixture}
        showTags={false}
      />,
    );

    expect(getAllByText("Watch the video")).toHaveLength(3);
  });

  it("renders the card tags when showTags is true", () => {
    const { getAllByText } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={caseStudiesSectionFixture}
        showTags={true}
      />,
    );

    expect(getAllByText("primary")).toHaveLength(3);
  });

  it("doesn't render view all link when not enabled", () => {
    const { queryByRole } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={caseStudiesSectionFixture}
      />,
    );

    expect(
      queryByRole("link", { name: /View all case studies/i }),
    ).not.toBeInTheDocument();
  });

  it("renders view all link when enabled", () => {
    const { getByRole } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={caseStudiesSectionFixture}
        showViewAllLink={true}
      />,
    );

    expect(
      getByRole("link", { name: /View all case studies/i }),
    ).toBeInTheDocument();
  });
});
