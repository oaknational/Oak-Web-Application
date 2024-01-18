import specialistUnitListingFixture from "./SpecialistUnitListing.fixture";
import SpecialistUnitListing from "./SpecialistUnitListing.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("SpecialistUnitListing", () => {
  it("renders component", () => {
    const { getByTestId } = render(
      <SpecialistUnitListing curriculumData={specialistUnitListingFixture()} />,
    );
    const unit = getByTestId("specialist-unit-grid");

    expect(unit).toBeInTheDocument();
  });
  it("renders developmental stage navigation tabs", () => {
    const { getByTestId } = render(
      <SpecialistUnitListing curriculumData={specialistUnitListingFixture()} />,
    );
    const developmentalNav = getByTestId("developmental-nav");
    expect(developmentalNav).toBeInTheDocument();
  });

  it("renders themes filters ", () => {
    const { queryAllByText } = render(
      <SpecialistUnitListing curriculumData={specialistUnitListingFixture()} />,
    );
    // mobile and desktop both rendered
    const themePrimary = queryAllByText("Test Theme Primary");
    const themeSecondary = queryAllByText("Test Theme Secondary");

    expect(themePrimary).toHaveLength(2);
    expect(themeSecondary).toHaveLength(2);
  });

  it("speacialist unit list", () => {
    const { getAllByTestId } = render(
      <SpecialistUnitListing curriculumData={specialistUnitListingFixture()} />,
    );
    const unitListItems = getAllByTestId("unit-list-item");
    expect(unitListItems).toHaveLength(3);
  });
});
