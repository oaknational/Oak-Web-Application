import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import teachersKeyStageSubjectTiersFixture from "../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectTiers.fixture";

import SubjectTierListing from "./SubjectTierListing";

const curriculumData = teachersKeyStageSubjectTiersFixture();

const render = renderWithProviders();

describe("SubjectTierListing", () => {
  test("render a tier subject component with heading ", () => {
    render(<SubjectTierListing curriculumData={curriculumData} />);

    expect(screen.getByText("Learning tiers")).toBeInTheDocument();
  });

  test("render a list of card items with the name of the tiers ", () => {
    const { getAllByRole } = render(
      <SubjectTierListing curriculumData={curriculumData} />
    );

    expect(getAllByRole("heading", { level: 3 })[0]?.textContent).toBe(
      "Foundation"
    );
    expect(getAllByRole("heading", { level: 3 })[1]?.textContent).toBe("Core");
    expect(getAllByRole("heading", { level: 3 })[2]?.textContent).toBe(
      "Higher"
    );
  });

  test("each card items will link have a link to a different query ", () => {
    const { getByRole } = render(
      <SubjectTierListing curriculumData={curriculumData} />
    );

    expect(getByRole("link", { name: "Foundation" })).toHaveAttribute(
      "href",
      "/beta/teachers/key-stages/ks4/subjects/maths/units?tier=foundation"
    );
    expect(getByRole("link", { name: "Core" })).toHaveAttribute(
      "href",
      "/beta/teachers/key-stages/ks4/subjects/maths/units?tier=core"
    );
    expect(getByRole("link", { name: "Higher" })).toHaveAttribute(
      "href",
      "/beta/teachers/key-stages/ks4/subjects/maths/units?tier=higher"
    );
  });
});
