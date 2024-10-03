import { within } from "@testing-library/dom";

import specialistUnitListingFixture from "./SpecialistUnitListing.fixture";
import SpecialistUnitListing from "./SpecialistUnitListing.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("SpecialistUnitListing", () => {
  test("renders component", () => {
    const { getByTestId } = render(
      <SpecialistUnitListing curriculumData={specialistUnitListingFixture()} />,
    );
    const unit = getByTestId("specialist-unit-grid");

    expect(unit).toBeInTheDocument();
  });
  test("renders development stage navigation tabs", () => {
    const { getByTestId } = render(
      <SpecialistUnitListing curriculumData={specialistUnitListingFixture()} />,
    );
    const developmentNav = getByTestId("development-nav");
    expect(developmentNav).toBeInTheDocument();
  });

  test("renders themes filters ", () => {
    const { queryAllByText } = render(
      <SpecialistUnitListing curriculumData={specialistUnitListingFixture()} />,
    );

    const themePrimary = queryAllByText("Test Theme Primary");
    const themeSecondary = queryAllByText("Test Theme Secondary");

    expect(themePrimary).toHaveLength(1);
    expect(themeSecondary).toHaveLength(1);
  });

  test("specialist unit list", () => {
    const { getByLabelText } = render(
      <SpecialistUnitListing curriculumData={specialistUnitListingFixture()} />,
    );
    const unitList = getByLabelText("A list of units");
    expect(unitList).toBeInTheDocument();

    const listItems = within(unitList).getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
  });
});
