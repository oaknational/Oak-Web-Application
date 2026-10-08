import { CaseStudiesSection } from ".";

import {
  caseStudy,
  otherCaseStudies,
} from "@/__tests__/pages/about-us/case-studies/case-studies.fixtures";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CaseStudiesSection", () => {
  it("renders correctly when 3 case studies are provided", () => {
    const { baseElement, getByRole, getAllByRole } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={otherCaseStudies}
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

  it("renders 'Watch the video' link when the case study contains a video and showTags is false", () => {
    const { container, getAllByText } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={otherCaseStudies}
        showTags={false}
      />,
    );

    const caseStudiesWithVideo = otherCaseStudies.filter((cs) => cs.video);
    expect(getAllByText("Watch the video")).toHaveLength(
      caseStudiesWithVideo.length,
    );
    expect(container).toHaveTextContent("Watch the video");
  });

  it("renders the card tags when showTags is true", () => {
    const { container, getAllByText } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={otherCaseStudies}
        showTags={true}
      />,
    );

    const caseStudiesWithTag = otherCaseStudies.filter((cs) => cs.tag);
    expect(getAllByText("Primary")).toHaveLength(caseStudiesWithTag.length);
    expect(container).toHaveTextContent("Primary");
  });

  it("doesn't render view all link when not enabled", () => {
    const { queryByRole } = render(
      <CaseStudiesSection
        title={"Case studies"}
        caseStudies={otherCaseStudies}
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
        caseStudies={otherCaseStudies}
        showViewAllLink={true}
      />,
    );

    expect(
      getByRole("link", { name: /View all case studies/i }),
    ).toBeInTheDocument();
  });
});
