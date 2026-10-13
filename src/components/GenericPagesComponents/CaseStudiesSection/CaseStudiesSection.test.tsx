import { CaseStudiesSection } from ".";

import {
  caseStudy,
  otherCaseStudies,
} from "@/__tests__/pages/about-us/case-studies/case-studies.fixtures";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CaseStudiesSection", () => {
  it("renders correctly when 3 case studies are provided", () => {
    const { baseElement, getByRole, getAllByRole, getAllByText } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={otherCaseStudies}
      />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { name: "Case studies" })).toBeInTheDocument();
    expect(getAllByRole("listitem")).toHaveLength(3);
    expect(getAllByText("Primary")).toHaveLength(2);
  });

  it("renders correctly when 2 case studies are provided", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={otherCaseStudies.slice(0, 2)}
      />,
    );

    expect(baseElement).toMatchSnapshot();
    expect(getByRole("heading", { name: "Case studies" })).toBeInTheDocument();
    expect(getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders only the first 3 case studies when more are provided", () => {
    const caseStudiesWithFourth = [caseStudy, ...otherCaseStudies];

    const { getAllByRole } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={caseStudiesWithFourth}
      />,
    );

    expect(getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders view all link", () => {
    const { getByRole } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={otherCaseStudies}
      />,
    );

    expect(
      getByRole("link", { name: /View all case studies/i }),
    ).toBeInTheDocument();
  });
});
