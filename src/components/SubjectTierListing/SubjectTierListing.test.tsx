import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import { programmeListingFixture } from "../../node-lib/curriculum-api/fixtures/tierListing.fixture";

import SubjectTierListing from "./SubjectTierListing";

const curriculumData = programmeListingFixture();

const render = renderWithProviders();

describe("SubjectTierListing", () => {
  test("render a tier subject component with heading ", () => {
    render(<SubjectTierListing {...curriculumData} />);

    expect(screen.getByText("Learning tiers")).toBeInTheDocument();
  });

  test("render a list of card items with the name of the tiers ", () => {
    const { getAllByRole } = render(<SubjectTierListing {...curriculumData} />);

    expect(getAllByRole("heading", { level: 3 })[1]?.textContent).toBe(
      "Foundation"
    );
    expect(getAllByRole("heading", { level: 3 })[0]?.textContent).toBe("Core");
    expect(getAllByRole("heading", { level: 3 })[2]?.textContent).toBe(
      "Higher"
    );
  });

  test("each card items will link have a link to a different query ", () => {
    const { getByRole } = render(<SubjectTierListing {...curriculumData} />);

    expect(getByRole("link", { name: "Foundation" })).toHaveAttribute(
      "href",
      "/beta/teachers/programmes/maths-secondary-ks4-foundation/units"
    );
    expect(getByRole("link", { name: "Core" })).toHaveAttribute(
      "href",
      "/beta/teachers/programmes/maths-secondary-ks4-core/units"
    );
    expect(getByRole("link", { name: "Higher" })).toHaveAttribute(
      "href",
      "/beta/teachers/programmes/maths-secondary-ks4-higher/units"
    );
  });
});
