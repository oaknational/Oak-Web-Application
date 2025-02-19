import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";
import { act } from "@testing-library/react";

import CurriculumVisualiser from "./CurriculumVisualiser";

import {
  noMissingUnitsFixture,
  missingUnitsForEntirePhaseFixture,
  missingUnitsForFirstYearFixture,
  missingUnitsForSecondYearFixture,
  missingConsecutiveUnitsAtStartFixture,
  missingConsecutiveUnitsAtEndFixture,
  missingUnitsInMiddleFixture,
  missingAlternateUnitsFixture,
  missingUnitForLastYearFixture,
} from "@/utils/curriculum/fixtures/curriculumFilterFixturesGenerator";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { YearData } from "@/utils/curriculum/types";

const render = renderWithProviders();
const curriculumThreadHighlighted = jest.fn();
const yearGroupSelected = jest.fn();
const unitInformationViewed = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumThreadHighlighted: (...args: unknown[]) =>
        curriculumThreadHighlighted(...args),
      yearGroupSelected: (...args: unknown[]) => yearGroupSelected(...args),
      unitInformationViewed: (...args: unknown[]) =>
        unitInformationViewed(...args),
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
  unitData: null,
  filters: {
    years: ["7", "8", "9", "10", "11"],
    tiers: [],
    childSubjects: [],
    subjectCategories: [],
    threads: [],
  },
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
      tiers: [],
      subjectCategories: [],
      labels: [],
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

    expect(unitInformationViewed).toHaveBeenCalledTimes(1);
    expect(unitInformationViewed).toHaveBeenCalledWith({
      unitName: "Step into the unknown: fiction reading and creative writing",
      unitSlug: "step-into-the-unknown-fiction-reading-and-creative-writing",
      yearGroupName: "7",
      yearGroupSlug: "7",
      subjectSlug: "english",
      subjectTitle: "English",
      unitHighlighted: false,
      analyticsUseCase: null,
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

  test("Units exist for subject category in each year of phase", async () => {
    const noMissingUnitsFixtureWithProps = {
      ...curriculumVisualiserFixture,
      yearData: noMissingUnitsFixture as YearData,
    };

    const filterFixture = {
      childSubjects: [],
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

  test("No units for subject category in entire phase", async () => {
    const missingUnitsForEntirePhaseFixtureWithProps = {
      ...curriculumVisualiserFixture,
      yearData: missingUnitsForEntirePhaseFixture as YearData,
    };

    const filterFixture = {
      childSubjects: [],
      subjectCategories: ["1"],
      tiers: [],
      years: ["7", "8", "9", "10", "11"],
      threads: [],
    };

    const { findAllByText } = render(
      <CurriculumVisualiser
        {...missingUnitsForEntirePhaseFixtureWithProps}
        filters={filterFixture}
      />,
    );

    expect(
      await findAllByText(/No units for filter in this year/i),
    ).toHaveLength(5);
  });

  test("No units for subject category in first year of phase", async () => {
    const missingUnitsForFirstYearFixtureWithProps = {
      ...curriculumVisualiserFixture,
      yearData: missingUnitsForFirstYearFixture as YearData,
    };

    const filterFixture = {
      childSubjects: [],
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
      await findAllByText(/'sub-cat-1' units continue in Year 8/i),
    ).toHaveLength(1);
  });

  test("No units for subject category in second year of phase", async () => {
    const missingUnitsForSecondYearFixtureWithProps = {
      ...curriculumVisualiserFixture,
      yearData: missingUnitsForSecondYearFixture as YearData,
    };

    const filterFixture = {
      childSubjects: [],
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

  test("No units for the subject category for consecutive years at the start of the phase", async () => {
    const missingConsecutiveUnitsAtStartFixtureWithProps = {
      ...curriculumVisualiserFixture,
      yearData: missingConsecutiveUnitsAtStartFixture as YearData,
    };

    const filterFixture = {
      childSubjects: [],
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
      await findAllByText(/'sub-cat-1' units continue in Year 10/i),
    ).toHaveLength(3);

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
    const messages = await findAllByText(/No further 'sub-cat-1' units/i);
    expect(messages).toHaveLength(3);
  });

  test("No alternate units in the phase", async () => {
    const missingAlternateUnitsFixtureWithProps = {
      ...curriculumVisualiserFixture,
      yearData: missingAlternateUnitsFixture as YearData,
    };

    const filterFixture = {
      childSubjects: [],
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
      await findByText(/'sub-cat-1' units continue in Year 8/i),
    ).toBeInTheDocument();
    expect(
      await findByText(/'sub-cat-1' units continue in Year 10/i),
    ).toBeInTheDocument();
    expect(
      await findByText(/No further 'sub-cat-1' units/i),
    ).toBeInTheDocument();
  });

  test("No unit at the end of the phase", async () => {
    const missingUnitForLastYearFixtureWithProps = {
      ...curriculumVisualiserFixture,
      yearData: missingUnitForLastYearFixture as YearData,
    };

    const filterFixture = {
      childSubjects: [],
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
      await findByText(/No further 'sub-cat-1' units/i),
    ).toBeInTheDocument();
  });
});
