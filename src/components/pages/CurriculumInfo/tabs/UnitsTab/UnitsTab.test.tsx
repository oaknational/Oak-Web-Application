import UnitsTab from "./UnitsTab";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";

describe("Component - Unit Tab", () => {
  test("user can see the heading", async () => {
    const { getAllByTestId } = renderWithTheme(
      <UnitsTab data={curriculumUnitsTabFixture()} />
    );
    expect(getAllByTestId("heading")[0]).toBeInTheDocument();
  });

  test("user can see the unit cards", async () => {
    const { findAllByTestId } = renderWithTheme(
      <UnitsTab data={curriculumUnitsTabFixture()} />
    );
    const unitCards = await findAllByTestId("unitCard");
    expect(unitCards[0]).toBeInTheDocument();
  });

  test("number of unit cards matches units", async () => {
    const { findAllByTestId } = renderWithTheme(
      <UnitsTab data={curriculumUnitsTabFixture()} />
    );
    const unitCards = await findAllByTestId("unitCard");
    expect(unitCards).toHaveLength(curriculumUnitsTabFixture().units.length);
  });

  test("builds links to unit lesson index", async () => {
    const { findAllByTestId } = renderWithTheme(
      <UnitsTab data={curriculumUnitsTabFixture()} />
    );
    const unitLinks = await findAllByTestId("unitLink");
    if (unitLinks.length === 0 || !unitLinks[0]) {
      throw new Error("No unit links found");
    }
    const unit = curriculumUnitsTabFixture().units[0];
    if (unit === undefined) {
      throw new Error("Fixture unit missing");
    }
    expect(unitLinks[0].getAttribute("href")).toContain(unit.slug);
  });
});
