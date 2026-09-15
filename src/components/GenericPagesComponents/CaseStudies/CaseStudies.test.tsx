import { caseStudiesFixture } from "./CaseStudies.fixtures";

import { CaseStudies } from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CaseStudies", () => {
  it("renders correctly when 3 case studies are provided", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <CaseStudies title={"Case studies"} caseStudies={caseStudiesFixture} />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { name: "Case studies" })).toBeInTheDocument();
    expect(
      getAllByRole("link", { name: /case study [1-3] watch the video/i }),
    ).toHaveLength(3);
  });

  it("renders correctly when 2 case studies are provided", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <CaseStudies
        title={"Case studies"}
        caseStudies={caseStudiesFixture.slice(0, 2)}
      />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { name: "Case studies" })).toBeInTheDocument();
    expect(
      getAllByRole("link", { name: /case study [1-2] watch the video/i }),
    ).toHaveLength(2);
  });

  it("renders only the first 3 case studies when more are provided", () => {
    const caseStudiesWithFourth = [
      ...caseStudiesFixture,
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

    const { getAllByRole, queryByRole } = render(
      <CaseStudies
        title={"Case studies"}
        caseStudies={caseStudiesWithFourth}
      />,
    );

    expect(getAllByRole("link", { name: /watch the video/i })).toHaveLength(3);
    expect(
      queryByRole("link", { name: /case study 4 watch the video/i }),
    ).not.toBeInTheDocument();
  });
});
