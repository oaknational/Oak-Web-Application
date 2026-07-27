import { act, screen } from "@testing-library/react";

import { ProgrammeUnitList } from "./UnitList";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { getOakUiColor } from "@/__tests__/__helpers__/getOakUiColor";
import { createFilter } from "@/fixtures/curriculum/filters";
import { createThread } from "@/fixtures/curriculum/thread";
import { createUnit } from "@/fixtures/curriculum/unit";
import { createUnitOption } from "@/fixtures/curriculum/unitOption";
import { createYearData } from "@/fixtures/curriculum/yearData";
import { getKeyStageTitle } from "@/utils/curriculum/formatting";

const render = renderWithProviders();

jest.mock("next/navigation", () => ({
  __esModule: true,
  usePathname: jest.fn(() => "/"),
}));

const unitOverviewAccessedMock = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      unitOverviewAccessed: unitOverviewAccessedMock,
    },
  }),
}));

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(() => ({
    isSignedIn: false,
  })),
}));

jest.mock("@/hooks/useAnalyticsPageProps", () => ({
  __esModule: true,
  default: () => ({ analyticsUseCase: null }),
}));

const emptyStateMessage = "No units in this category";
jest.mock("@/utils/curriculum/formatting", () => ({
  ...jest.requireActual("@/utils/curriculum/formatting"),
  getSubjectCategoryMessage: () => emptyStateMessage,
}));

const defaultProps = {
  units: [
    createUnit({ slug: "unit-one", title: "Unit One" }),
    createUnit({ slug: "unit-two", title: "Unit Two" }),
  ],
  yearData: {
    "7": createYearData({}),
  },
  year: "7",
  filters: createFilter({}),
};

describe("ProgrammeUnitList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a list of unit links when units are provided", () => {
    render(<ProgrammeUnitList {...defaultProps} />);

    expect(screen.getByRole("link", { name: /Unit One/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Unit Two/i })).toBeInTheDocument();
  });

  it("renders getSubjectCategoryMessage when units array is empty", () => {
    render(<ProgrammeUnitList {...defaultProps} units={[]} />);

    expect(screen.getByText(emptyStateMessage)).toBeInTheDocument();
  });

  it("renders list as an ordered list", () => {
    const { container } = render(<ProgrammeUnitList {...defaultProps} />);

    const list = container.querySelector("ol");
    expect(list).toBeInTheDocument();
  });

  it("calls track.unitOverviewAccessed when a unit link is clicked", async () => {
    render(<ProgrammeUnitList {...defaultProps} />);

    const link = screen.getByRole("link", { name: /Unit One/i });
    await act(async () => {
      link.click();
    });

    expect(unitOverviewAccessedMock).toHaveBeenCalledTimes(1);
    expect(unitOverviewAccessedMock).toHaveBeenCalledWith(
      expect.objectContaining({
        unitName: "Unit One",
        unitSlug: "unit-one",
        componentType: "unit_info_button",
      }),
    );
  });

  describe("thread highlighting", () => {
    const thread = createThread({
      slug: "invasion-migration-and-settlement",
      title: "Invasion, migration and settlement",
    });

    const optionalityUnit = createUnit({
      slug: "optionality-unit",
      title: "Historical options",
      threads: [thread],
      unit_options: [
        createUnitOption({
          slug: "medicine-in-britain",
          title: "Medicine in Britain, c1250–present",
        }),
        createUnitOption({
          slug: "another-option",
          title: "Another historical option",
        }),
      ],
    });

    it("highlights optionality child cards when the unit matches the selected thread", () => {
      render(
        <ProgrammeUnitList
          {...defaultProps}
          units={[optionalityUnit]}
          filters={createFilter({ threads: [thread.slug] })}
        />,
      );

      const cards = screen.getAllByTestId("card-listing-container");
      expect(cards).toHaveLength(3);
      expect(cards[0]).toHaveStyle({ background: getOakUiColor("bg-primary") });
      expect(cards[1]).toHaveStyle({
        background: getOakUiColor("bg-inverted"),
      });
      expect(cards[2]).toHaveStyle({
        background: getOakUiColor("bg-inverted"),
      });
    });

    it("does not highlight optionality child cards when the unit does not match the selected thread", () => {
      render(
        <ProgrammeUnitList
          {...defaultProps}
          units={[optionalityUnit]}
          filters={createFilter({ threads: ["other-thread"] })}
        />,
      );

      const cards = screen.getAllByTestId("card-listing-container");
      cards.forEach((card) => {
        expect(card).toHaveStyle({ background: getOakUiColor("bg-primary") });
      });
    });

    it("highlights a normal unit card when it matches the selected thread", () => {
      const normalUnit = createUnit({
        slug: "normal-unit",
        title: "Normal Unit",
        threads: [thread],
      });

      render(
        <ProgrammeUnitList
          {...defaultProps}
          units={[normalUnit]}
          filters={createFilter({ threads: [thread.slug] })}
        />,
      );

      const cards = screen.getAllByTestId("card-listing-container");
      expect(cards).toHaveLength(1);
      expect(cards[0]).toHaveStyle({
        background: getOakUiColor("bg-inverted"),
      });
    });

    it("does not highlight any cards when no thread filter is active", () => {
      const normalUnit = createUnit({
        slug: "normal-unit",
        title: "Normal Unit",
        threads: [thread],
      });

      render(
        <ProgrammeUnitList
          {...defaultProps}
          units={[normalUnit, optionalityUnit]}
          filters={createFilter({ threads: [] })}
        />,
      );

      const cards = screen.getAllByTestId("card-listing-container");
      cards.forEach((card) => {
        expect(card).toHaveStyle({ background: getOakUiColor("bg-primary") });
      });
    });
  });
});

describe("getKeyStageTitle", () => {
  it.each([
    ["ks1", "Key stage 1"],
    ["ks2", "Key stage 2"],
    ["ks3", "Key stage 3"],
    ["ks4", "Key stage 4"],
  ] as const)("maps '%s' to '%s'", (slug, expected) => {
    expect(getKeyStageTitle(slug)).toBe(expected);
  });

  it('returns "Early Years Foundation stage" for early-years-foundation-stage', () => {
    expect(getKeyStageTitle("early-years-foundation-stage")).toBe(
      "Early Years Foundation stage",
    );
  });

  it("returns ks1 for 'all-ks slugs", () => {
    expect(getKeyStageTitle("all-ks")).toBe("Key stage 1");
  });
});
