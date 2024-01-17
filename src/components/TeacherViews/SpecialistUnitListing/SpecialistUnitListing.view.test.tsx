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
  test("renders developmental stage navigation tabs", () => {
    const { getByTestId } = render(
      <SpecialistUnitListing curriculumData={specialistUnitListingFixture()} />,
    );
    const developmentalNav = getByTestId("developmental-nav");
    expect(developmentalNav).toBeInTheDocument();
  });

  test("renders themes filters ", () => {
    const { getByText } = render(
      <SpecialistUnitListing curriculumData={specialistUnitListingFixture()} />,
    );
    const themePrimary = getByText("Test Theme Primary");
    const themeSecondary = getByText("Test Theme Secondary");

    expect(themePrimary).toBeInTheDocument();
    expect(themeSecondary).toBeInTheDocument();
  });

  test("speacialist unit list", () => {
    const { getAllByTestId } = render(
      <SpecialistUnitListing curriculumData={specialistUnitListingFixture()} />,
    );
    const unitListItems = getAllByTestId("unit-list-item");
    expect(unitListItems).toHaveLength(3);
  });
});
