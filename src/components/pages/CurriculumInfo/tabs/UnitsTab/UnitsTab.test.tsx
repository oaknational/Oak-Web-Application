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
  test("number of unit cards matches units", async () => {
    const { findAllByTestId } = renderWithTheme(
      <UnitsTab data={curriculumUnitsTabFixture()} />
    );
    const unitCards = await findAllByTestId("unitCard");
    expect(unitCards).toHaveLength(
      curriculumUnitsTabFixture().units.length * 3
    );
  });
  test("number of threads matches data", async () => {
    const { findAllByTestId } = renderWithTheme(
      <UnitsTab data={curriculumUnitsTabFixture()} />
    );
    const threadOptions = await findAllByTestId("threadOption");
    expect(threadOptions).toHaveLength(
      curriculumUnitsTabFixture().threads.length
    );
  });
});
