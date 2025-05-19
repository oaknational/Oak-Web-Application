import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";
import { act, within } from "@testing-library/react";

import {
  noMissingUnitsFixture,
  missingUnitsForFirstYearPrimaryFixture,
  missingConsecutiveUnitsAtStartPrimaryFixture,
  missingUnitsForFirstYearFixture,
  missingUnitsForSecondYearFixture,
  missingConsecutiveUnitsAtStartFixture,
  missingConsecutiveUnitsAtEndFixture,
  missingUnitsInMiddleFixture,
  missingAlternateUnitsFixture,
  missingUnitForLastYearFixture,
  primaryEnglishYearData,
  primaryScienceYearData,
  secondaryMathsYearData,
  secondaryScienceYearData,
} from "./fixtures";

import CurriculumVisualiser from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { YearData } from "@/utils/curriculum/types";

const render = renderWithProviders();
const curriculumThreadHighlighted = jest.fn();
const yearGroupSelected = jest.fn();
const unitOverviewAccessed = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumThreadHighlighted: (...args: unknown[]) =>
        curriculumThreadHighlighted(...args),
      yearGroupSelected: (...args: unknown[]) => yearGroupSelected(...args),
      unitOverviewAccessed: (...args: unknown[]) =>
        unitOverviewAccessed(...args),
    },
  }),
}));

const curriculumVisualiserFixture = {
  updateMobileHeaderScroll: jest.fn(() => {}),
  handleSelectThread: jest.fn(() => {}),
  handleSelectTier: jest.fn(() => {}),
  handleSelectSubjectCategory: jest.fn(() => {}),
  handleSelectSubject: jest.fn(() => {}),
  isSelectedThread: jest.fn(() => true),
  setUnitData: jest.fn(() => {}),
  highlightedUnitCount: jest.fn(() => 1),
  trackSelectYear: jest.fn(() => {}),
  threadOptions: [],
  unitData: null,
  filters: {
    years: ["7", "8", "9", "10", "11"],
    tiers: [],
    childSubjects: [],
    pathways: [],
    subjectCategories: [],
    threads: [],
  },
  ks4Options: [],
  selectedYear: null,
  ks4OptionSlug: "edexcel",
  yearData: {
    "7": {
      units: [
        {
          connection_prior_unit_description:
            "In 'When the Sky Falls' pupils write narratives inspired by a text. In 'Step Into the Unknown', using extracts from texts from the literary canon, pupils write descriptions of settings.",
          connection_future_unit_description:
            "In 'Step into the Unknown', pupils learn how to use a variety of sentences for deliberate effect. In the 'Dystopian Settings' unit, pupils will continue to use a range of sentence structures, to create atmospheric descriptions.",
          connection_future_unit_title:
            "Dystopian settings: descriptive writing",
          connection_prior_unit_title:
            "'When the Sky Falls': narrative and diary writing",
          domain: null,
          domain_id: null,
          examboard: null,
          examboard_slug: null,
          planned_number_of_lessons: 32,
          phase: "Secondary",
          phase_slug: "secondary",
          keystage_slug: "ks3",
          lessons: [
            {
              slug: "analysing-character-in-an-unseen-extract-from-oliver-twist",
              title:
                "Analysing character in an unseen extract from 'Oliver Twist'",
              _state: "new",
            },
            {
              slug: "explaining-how-a-writer-uses-pathetic-fallacy-to-create-tension",
              title:
                "Explaining how a writer uses pathetic fallacy to create tension",
              _state: "new",
            },
          ],
          order: 1,
          slug: "step-into-the-unknown-fiction-reading-and-creative-writing",
          subject: "English",
          subject_slug: "english",
          subject_parent: null,
          subject_parent_slug: null,
          tags: null,
          subjectcategories: null,
          tier: null,
          tier_slug: null,
          threads: [
            {
              title:
                "Exploring the unknown: mystery, intrigue and Gothic fiction",
              slug: "exploring-the-unknown-mystery-intrigue-and-gothic-fiction",
              order: 1,
            },
          ],
          title: "Step into the unknown: fiction reading and creative writing",
          unit_options: [],
          year: "7",
          cycle: "1",
          why_this_why_now: null,
          description: null,
          state: "published",
        },
      ],
      childSubjects: [],
      pathways: [],
      tiers: [],
      subjectCategories: [],
      isSwimming: false,
      groupAs: null,
    },
  },
  selectedThread: null,
  setVisibleMobileYearRefID: jest.fn(() => {}),
};

describe("visualiser", () => {
  beforeEach(() => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
    jest.clearAllMocks();
  });

  const resizeWindow = (x: number, y: number) => {
    window.innerWidth = x;
    window.innerHeight = y;
    window.dispatchEvent(new Event("resize"));
  };

  test("visualiser is visible on mobile", async () => {
    resizeWindow(390, 844);

    const { findByTestId } = render(
      <CurriculumVisualiser {...curriculumVisualiserFixture} />,
    );
    // Open thread modal
    const filterThreadsButton = await findByTestId("curriculum-visualiser");

    expect(filterThreadsButton).toBeInTheDocument();
  });
  test("visualiser is visible on desktop", async () => {
    const { findByTestId } = render(
      <CurriculumVisualiser {...curriculumVisualiserFixture} />,
    );
    // Open thread modal
    const filterThreadsButton = await findByTestId("curriculum-visualiser");

    expect(filterThreadsButton).toBeInTheDocument();
  });

  test("correct number of units displayed", async () => {
    resizeWindow(390, 844);
    const { findAllByTestId } = render(
      <CurriculumVisualiser {...curriculumVisualiserFixture} />,
    );

    const unitCards = await findAllByTestId("unit-cards");

    expect(unitCards).toHaveLength(1);
  });

  test("selecting a unit opens up the modal dialog", async () => {
    const { findAllByTestId, findByTestId } = render(
      <CurriculumVisualiser {...curriculumVisualiserFixture} />,
    );

    const units = await findAllByTestId("unit-cards");
    const unit = units[0]!;

    await act(async () => {
      await userEvent.click(unit.querySelector("button")!);
    });

    await waitFor(async () => {
      const sidebar = await findByTestId("sidebar-modal-wrapper");
      expect(sidebar).toBeInTheDocument();
    });

    expect(unitOverviewAccessed).toHaveBeenCalledTimes(1);
    expect(unitOverviewAccessed).toHaveBeenCalledWith({
      unitName: "Step into the unknown: fiction reading and creative writing",
      unitSlug: "step-into-the-unknown-fiction-reading-and-creative-writing",
      yearGroupName: "Year 7",
      yearGroupSlug: "7",
      subjectSlug: "english",
      subjectTitle: "English",
      unitHighlighted: false,
      analyticsUseCase: null,
      componentType: "unit_info_button",
      engagementIntent: "use",
      eventVersion: "2.0.0",
      isUnitPublished: false,
      platform: "owa",
      product: "curriculum visualiser",
      threadSlug: null,
      threadTitle: null,
    });
  });
});

describe("Curriculum visualiser filter states", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  describe("Secondary phase", () => {
    test("Units exist for subject category in each year of phase", async () => {
      const noMissingUnitsFixtureWithProps = {
        ...curriculumVisualiserFixture,
        yearData: noMissingUnitsFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["1"],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
      };

      const { findAllByTestId } = render(
        <CurriculumVisualiser
          {...noMissingUnitsFixtureWithProps}
          filters={filterFixture}
        />,
      );

      const unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(5);
    });

    test("No units for subject category in first year of phase", async () => {
      const missingUnitsForFirstYearFixtureWithProps = {
        ...curriculumVisualiserFixture,
        yearData: missingUnitsForFirstYearFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["1"],
        tiers: [],
        years: ["7"],
        threads: [],
      };

      const { findAllByText } = render(
        <CurriculumVisualiser
          {...missingUnitsForFirstYearFixtureWithProps}
          filters={filterFixture}
        />,
      );
      expect(
        await findAllByText(/'sub-cat-1' units start in Year 8/i),
      ).toHaveLength(1);
    });

    test("No units for subject category in second year of phase", async () => {
      const missingUnitsForSecondYearFixtureWithProps = {
        ...curriculumVisualiserFixture,
        yearData: missingUnitsForSecondYearFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["1"],
        tiers: [],
        years: ["8"],
        threads: [],
      };

      const { findAllByText } = render(
        <CurriculumVisualiser
          {...missingUnitsForSecondYearFixtureWithProps}
          filters={filterFixture}
        />,
      );
      expect(
        await findAllByText(/'sub-cat-1' units continue in Year 9/i),
      ).toHaveLength(1);
    });

    test("No units for consecutive years at the start of the phase", async () => {
      const missingConsecutiveUnitsAtStartFixtureWithProps = {
        ...curriculumVisualiserFixture,
        yearData: missingConsecutiveUnitsAtStartFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["1"],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
      };

      const { findAllByTestId, findAllByText } = render(
        <CurriculumVisualiser
          {...missingConsecutiveUnitsAtStartFixtureWithProps}
          filters={filterFixture}
        />,
      );

      expect(
        await findAllByText(/'sub-cat-1' units start in Year 10/i),
      ).toHaveLength(1);
      expect(
        await findAllByText(/'sub-cat-1' units continue in Year 10/i),
      ).toHaveLength(2);

      const unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(2);
    });

    test("No units in the middle of the phase", async () => {
      const missingUnitsInMiddleFixtureWithProps = {
        ...curriculumVisualiserFixture,
        yearData: missingUnitsInMiddleFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["1"],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
      };

      const { findAllByText, findAllByTestId } = render(
        <CurriculumVisualiser
          {...missingUnitsInMiddleFixtureWithProps}
          filters={filterFixture}
        />,
      );

      expect(
        await findAllByText(/'sub-cat-1' units continue in Year 11/i),
      ).toHaveLength(3);
      const unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(2);
    });

    test("No consecutive subsequent units at the end of the phase", async () => {
      const missingConsecutiveUnitsAtEndFixtureWithProps = {
        ...curriculumVisualiserFixture,
        yearData: missingConsecutiveUnitsAtEndFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["1"],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
      };

      const { findAllByText, findAllByTestId } = render(
        <CurriculumVisualiser
          {...missingConsecutiveUnitsAtEndFixtureWithProps}
          filters={filterFixture}
        />,
      );
      const unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(2);
      const messages = await findAllByText(
        /No 'sub-cat-1' units in this year group/i,
      );
      expect(messages).toHaveLength(3);
    });

    test("No alternate units in the phase", async () => {
      const missingAlternateUnitsFixtureWithProps = {
        ...curriculumVisualiserFixture,
        yearData: missingAlternateUnitsFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["1"],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
      };

      const { findByText, findAllByTestId } = render(
        <CurriculumVisualiser
          {...missingAlternateUnitsFixtureWithProps}
          filters={filterFixture}
        />,
      );

      const unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(2);
      expect(
        await findByText(/'sub-cat-1' units start in Year 8/i),
      ).toBeInTheDocument();
      expect(
        await findByText(/'sub-cat-1' units continue in Year 10/i),
      ).toBeInTheDocument();
      expect(
        await findByText(/No 'sub-cat-1' units in this year group/i),
      ).toBeInTheDocument();
    });

    test("No unit at the end of the phase", async () => {
      const missingUnitForLastYearFixtureWithProps = {
        ...curriculumVisualiserFixture,
        yearData: missingUnitForLastYearFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["1"],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
      };

      const { findByText } = render(
        <CurriculumVisualiser
          {...missingUnitForLastYearFixtureWithProps}
          filters={filterFixture}
        />,
      );
      expect(
        await findByText(/No 'sub-cat-1' units in this year group/i),
      ).toBeInTheDocument();
    });
  });

  describe("Primary phase", () => {
    test("No units for subject category in first year of phase", async () => {
      const missingUnitsForFirstYearPrimaryFixtureWithProps = {
        ...curriculumVisualiserFixture,
        yearData: missingUnitsForFirstYearPrimaryFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["1"],
        tiers: [],
        years: ["1", "2", "3", "4", "5", "6"],
        threads: [],
      };

      const { findAllByText, findAllByTestId } = render(
        <CurriculumVisualiser
          {...missingUnitsForFirstYearPrimaryFixtureWithProps}
          filters={filterFixture}
        />,
      );
      expect(
        await findAllByText(/'sub-cat-1' units start in Year 2/i),
      ).toHaveLength(1);
      const unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(5);
    });

    test("No units for consecutive years at the start of the primary phase", async () => {
      const missingConsecutiveUnitsAtStartPrimaryFixtureWithProps = {
        ...curriculumVisualiserFixture,
        yearData: missingConsecutiveUnitsAtStartPrimaryFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["1"],
        tiers: [],
        years: ["1", "2", "3", "4", "5", "6"],
        threads: [],
      };

      const { findAllByText, findAllByTestId } = render(
        <CurriculumVisualiser
          {...missingConsecutiveUnitsAtStartPrimaryFixtureWithProps}
          filters={filterFixture}
        />,
      );

      expect(
        await findAllByText(/'sub-cat-1' units start in Year 4/i),
      ).toHaveLength(1);
      expect(
        await findAllByText(/'sub-cat-1' units continue in Year 4/i),
      ).toHaveLength(2);
      const unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(3);
    });
  });
});

describe("Year group filter headings display correctly", () => {
  const baseFixture = {
    ...curriculumVisualiserFixture,
    yearData: {},
    ks4Options: [
      { slug: "core", title: "Core" },
      { slug: "gcse", title: "GCSE" },
    ],
  };

  describe("Secondary Phase", () => {
    describe("Secondary Science", () => {
      const secondaryScienceFixture = {
        ...baseFixture,
        yearData: secondaryScienceYearData as YearData,
      };

      test("displays all years - with no subject categories in subheadings for year 7-9, and child subjects and foundation tier in subheading for year 10-11", async () => {
        const filterFixture = {
          childSubjects: ["combined-science"],
          subjectCategories: ["-1"],
          tiers: ["higher"],
          years: ["7", "8", "9", "10", "11"],
          threads: [],
          pathways: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...secondaryScienceFixture}
            filters={filterFixture}
          />,
        );

        // Check each year block individually
        for (const year of ["7", "8", "9", "10", "11"]) {
          const type = ["10", "11"].includes(year) ? "non_core" : "core";
          const yearBlock = container.querySelector(
            `[data-testid="year-${type}-${year}"]`,
          ) as HTMLElement;
          expect(yearBlock).not.toBeNull();

          const yearHeading = within(yearBlock).getByTestId("year-heading");
          expect(yearHeading).toHaveTextContent(`Year ${year}`);

          if (["7", "8", "9"].includes(year)) {
            // Years 7-9 should not have subheadings
            const subheading =
              within(yearBlock).queryByTestId("year-subheading");
            expect(subheading).toBeNull();
          } else {
            // Years 10-11 should have subheadings with combined science and higher tier
            const subheading = within(yearBlock).getByTestId("year-subheading");
            expect(subheading).toHaveTextContent("Combined science, Higher");
          }
        }
      });

      test("displays nothing for 'All' subject category in subheading", async () => {
        const filterFixture = {
          subjectCategories: ["-1"],
          childSubjects: [],
          pathways: [],
          tiers: [],
          years: ["7"],
          threads: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...secondaryScienceFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-core-7"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 7");

        const subheading = within(yearBlock).queryByTestId("year-subheading");
        expect(subheading).toBeNull();
      });

      test("displays 'Biology' subject category in subheading", async () => {
        const filterFixture = {
          subjectCategories: ["1"],
          childSubjects: [],
          pathways: [],
          tiers: [],
          years: ["7"],
          threads: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...secondaryScienceFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-core-7"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 7");

        const subheading = within(yearBlock).getByTestId("year-subheading");
        expect(subheading).toHaveTextContent("Biology");
      });

      test("displays 'Chemistry' subject category in subheading", async () => {
        const filterFixture = {
          subjectCategories: ["2"],
          childSubjects: [],
          pathways: [],
          tiers: [],
          years: ["7"],
          threads: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...secondaryScienceFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-core-7"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 7");

        const subheading = within(yearBlock).getByTestId("year-subheading");
        expect(subheading).toHaveTextContent("Chemistry");
      });

      test("displays 'Physics' subject categories in subheading for Year 7", async () => {
        const filterFixture = {
          subjectCategories: ["3"],
          childSubjects: [],
          pathways: [],
          tiers: [],
          years: ["7"],
          threads: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...secondaryScienceFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-core-7"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 7");

        const subheading = within(yearBlock).getByTestId("year-subheading");
        expect(subheading).toHaveTextContent("Physics");
      });

      test("displays child subjects and foundation tier in subheading for Year 10", async () => {
        const filterFixture = {
          childSubjects: ["combined-science"],
          subjectCategories: [],
          tiers: ["foundation"],
          years: ["10"],
          threads: [],
          pathways: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...secondaryScienceFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-non_core-10"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 10");
        const subheading = within(yearBlock).getByTestId("year-subheading");
        expect(subheading).toHaveTextContent("Combined science, Foundation");
      });

      test("displays child subjects and higher tier in subheading for Year 11", async () => {
        const filterFixture = {
          childSubjects: ["combined-science"],
          subjectCategories: [],
          tiers: ["higher"],
          years: ["11"],
          threads: [],
          pathways: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...secondaryScienceFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-non_core-11"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 11");
        const subheading = within(yearBlock).getByTestId("year-subheading");
        expect(subheading).toHaveTextContent("Combined science, Higher");
      });

      test("Setting KS3 subject category does not affect the KS4 subheading being displayed", async () => {
        const filterFixture = {
          subjectCategories: ["2"],
          childSubjects: ["combined-science"],
          tiers: ["higher"],
          years: ["10"],
          threads: [],
          pathways: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...secondaryScienceFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-non_core-10"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 10");
        const subheading = within(yearBlock).getByTestId("year-subheading");
        expect(subheading).toHaveTextContent("Combined science, Higher");
      });
    });

    describe("Secondary Maths", () => {
      const secondaryMathsFixture = {
        ...baseFixture,
        yearData: secondaryMathsYearData as YearData,
      };

      test("displays Higher tier in year 10 subheading when selected", async () => {
        const filterFixture = {
          childSubjects: [],
          pathways: [],
          subjectCategories: [],
          tiers: ["higher"],
          years: ["10"],
          threads: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...secondaryMathsFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-non_core-10"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 10");
        const subheading = within(yearBlock).getByTestId("year-subheading");
        expect(subheading).toHaveTextContent("Higher");
      });

      test("displays Foundation tier in year 11 subheading when selected", async () => {
        const filterFixture = {
          childSubjects: [],
          pathways: [],
          subjectCategories: [],
          tiers: ["foundation"],
          years: ["10"],
          threads: [],
        };

        const { findByTestId } = render(
          <CurriculumVisualiser
            {...secondaryMathsFixture}
            filters={filterFixture}
          />,
        );

        const yearHeading10 = await findByTestId("year-heading");
        expect(yearHeading10).toHaveTextContent("Year 10");
        const subheading10 = await findByTestId("year-subheading");
        expect(subheading10).toHaveTextContent("Foundation");
      });
    });
  });

  describe("Primary Phase", () => {
    describe("Primary English", () => {
      const primaryEnglishFixture = {
        ...baseFixture,
        yearData: primaryEnglishYearData as YearData,
      };

      test("displays subject category in subheading for Year 1, Primary English", async () => {
        const filterFixture = {
          childSubjects: [],
          pathways: [],
          subjectCategories: ["4"],
          tiers: [],
          years: ["1"],
          threads: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...primaryEnglishFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-core-1"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 1");
        const subheading = within(yearBlock).getByTestId("year-subheading");
        expect(subheading).toHaveTextContent("Reading, writing & oracy");
      });
    });

    describe("Primary Science", () => {
      const primaryScienceFixture = {
        ...baseFixture,
        yearData: primaryScienceYearData as YearData,
      };

      test("displays Biology subject category in subheading", async () => {
        const filterFixture = {
          childSubjects: [],
          pathways: [],
          subjectCategories: ["1"],
          tiers: [],
          years: ["1"],
          threads: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...primaryScienceFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-core-1"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 1");
        const subheading = within(yearBlock).getByTestId("year-subheading");
        expect(subheading).toHaveTextContent("Biology");
      });

      test("displays Chemistry subject category in subheading", async () => {
        const filterFixture = {
          childSubjects: [],
          pathways: [],
          subjectCategories: ["2"],
          tiers: [],
          years: ["2"],
          threads: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...primaryScienceFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-core-2"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 2");
        const subheading = within(yearBlock).getByTestId("year-subheading");
        expect(subheading).toHaveTextContent("Chemistry");
      });

      test("displays Physics subject category in subheading", async () => {
        const filterFixture = {
          childSubjects: [],
          pathways: [],
          subjectCategories: ["3"],
          tiers: [],
          years: ["3"],
          threads: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...primaryScienceFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-core-3"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 3");
        const subheading = within(yearBlock).getByTestId("year-subheading");
        expect(subheading).toHaveTextContent("Physics");
      });

      test("displays nothing for 'All' subject category in subheading", async () => {
        const filterFixture = {
          childSubjects: [],
          pathways: [],
          subjectCategories: ["-1"],
          tiers: [],
          years: ["4"],
          threads: [],
        };

        const { container } = render(
          <CurriculumVisualiser
            {...primaryScienceFixture}
            filters={filterFixture}
          />,
        );

        const yearBlock = container.querySelector(
          '[data-testid="year-core-4"]',
        ) as HTMLElement;
        expect(yearBlock).not.toBeNull();

        const yearHeading = within(yearBlock).getByTestId("year-heading");
        expect(yearHeading).toHaveTextContent("Year 4");
        const subheading = within(yearBlock).queryByTestId("year-subheading");
        expect(subheading).toBeNull();
      });
    });
  });
});
