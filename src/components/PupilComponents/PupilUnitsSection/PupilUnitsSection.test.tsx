import {
  installMockIntersectionObserver,
  installMockResizeObserver,
} from "@oaknational/oak-components";

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
});
