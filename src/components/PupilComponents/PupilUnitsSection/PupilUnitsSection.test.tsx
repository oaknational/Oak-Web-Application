import {
  installMockIntersectionObserver,
  installMockResizeObserver,
} from "@oaknational/oak-components";
import { act } from "@testing-library/react";

import { PupilUnitsSection } from "./PupilUnitsSection";

import { unitBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/unitBrowseData.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

installMockResizeObserver();
installMockIntersectionObserver();

describe("PupilUnitsSection", () => {
  const subjectCategories = ["Biology", "Chemistry", "Physics"];
  const units = subjectCategories.map((category, i) => [
    unitBrowseDataFixture({
      unitSlug: "unit-slug" + i,
      unitData: {
        ...unitBrowseDataFixture({}).unitData,
        title: "Unit-" + i,
        subjectcategories: [category],
      },
      supplementaryData: { unitOrder: i },
    }),
  ]);

  it("renders subject categories and All", () => {
    const { getAllByText } = render(
      <PupilUnitsSection
        units={units}
        phase="primary"
        counterLength={null}
        counterText={null}
        titleSlot={<>Title</>}
        filterItems={["All"]}
        applyFilter={() => {}}
        subjectCategories={subjectCategories}
      />,
    );

    for (const category of subjectCategories) {
      expect(getAllByText(category)).toHaveLength(2);
    }

    expect(getAllByText("All")).toHaveLength(2);
  });

  it("filters units by filter items", () => {
    const { getByText } = render(
      <PupilUnitsSection
        units={units}
        phase="primary"
        counterLength={null}
        counterText={null}
        titleSlot={<>Title</>}
        filterItems={["Biology"]}
        applyFilter={() => {}}
        subjectCategories={subjectCategories}
      />,
    );

    expect(getByText("Unit-0")).toBeInTheDocument();
    expect(() => getByText("Unit-1")).toThrow();
    expect(() => getByText("Unit-2")).toThrow();
  });

  it("filters units by filter items", () => {
    const { getByText } = render(
      <PupilUnitsSection
        units={units}
        phase="primary"
        counterLength={null}
        counterText={null}
        titleSlot={<>Title</>}
        filterItems={["Chemistry"]}
        applyFilter={() => {}}
        subjectCategories={subjectCategories}
      />,
    );

    expect(getByText("Unit-1")).toBeInTheDocument();
    expect(() => getByText("Unit-0")).toThrow();
    expect(() => getByText("Unit-2")).toThrow();
  });

  it("displays all units when 'all' is selected", () => {
    const { getByText } = render(
      <PupilUnitsSection
        units={units}
        phase="primary"
        counterLength={null}
        counterText={null}
        titleSlot={<>Title</>}
        filterItems={["All"]}
        applyFilter={() => {}}
        subjectCategories={subjectCategories}
      />,
    );

    expect(getByText("Unit-0")).toBeInTheDocument();
    expect(getByText("Unit-1")).toBeInTheDocument();
    expect(getByText("Unit-2")).toBeInTheDocument();
  });
  it("should fire the onClick callback when a unit is clicked", () => {
    const onClickCallback = jest.fn();
    const { getByText } = render(
      <PupilUnitsSection
        units={units}
        phase="primary"
        counterLength={null}
        counterText={null}
        titleSlot={<>Title</>}
        filterItems={["All"]}
        applyFilter={() => {}}
        subjectCategories={subjectCategories}
        onUnitSelected={onClickCallback}
      />,
    );
    // Find the button and log its presence
    const button = getByText("Unit-0");
    expect(button).toBeInTheDocument(); // Ensure the button exists
    expect(button).toHaveTextContent("Unit-0"); // Ensure the button has the correct text

    // Simulate the button click
    act(() => {
      button.click(); // Manually trigger click
    });
    expect(onClickCallback).toHaveBeenCalled();
  });
  it("Should fire the onClick callback when a unit is clicked for multiple optionality units", () => {
    const onClickCallback = jest.fn();
    units.push([
      unitBrowseDataFixture({
        programmeFields: {
          ...unitBrowseDataFixture({}).programmeFields,
          optionality: "Optional 1",
        },
        unitSlug: "unit-slug-5",
        unitData: {
          ...unitBrowseDataFixture({}).unitData,
          title: "Unit-" + 3,
          subjectcategories: ["Category"],
        },
        supplementaryData: { unitOrder: 3 },
      }),
      unitBrowseDataFixture({
        programmeFields: {
          ...unitBrowseDataFixture({}).programmeFields,
          optionality: "Optional 2",
        },
        unitData: {
          ...unitBrowseDataFixture({}).unitData,
          title: "Unit-" + 3,
          subjectcategories: ["Category"],
        },
        supplementaryData: { unitOrder: 3 },
      }),
    ]);
    const { getByText } = render(
      <PupilUnitsSection
        units={units}
        phase="primary"
        counterLength={null}
        counterText={null}
        titleSlot={<>Title</>}
        filterItems={["All"]}
        applyFilter={() => {}}
        subjectCategories={subjectCategories}
        onUnitSelected={onClickCallback}
      />,
    );
    // Find the button and log its presence
    const button = getByText("Optional 1");
    expect(button).toBeInTheDocument(); // Ensure the button exists
    expect(button).toHaveTextContent("Optional 1"); // Ensure the button has the correct text

    // Simulate the button click
    act(() => {
      button.click(); // Manually trigger click
    });
    expect(onClickCallback).toHaveBeenCalled();
  });
});
