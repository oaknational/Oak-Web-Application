import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";
import { act } from "@testing-library/react";

import CurriculumVisualiser from "./CurriculumVisualiser";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();
const curriculumThreadHighlighted = vi.fn();
const yearGroupSelected = vi.fn();
const unitInformationViewed = vi.fn();

vi.mock("@/context/Analytics/useAnalytics", () => ({
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
  updateMobileHeaderScroll: vi.fn(() => {}),
  handleSelectThread: vi.fn(() => {}),
  handleSelectTier: vi.fn(() => {}),
  handleSelectSubjectCategory: vi.fn(() => {}),
  handleSelectSubject: vi.fn(() => {}),
  isSelectedThread: vi.fn(() => true),
  setUnitData: vi.fn(() => {}),
  highlightedUnitCount: vi.fn(() => 1),
  trackSelectYear: vi.fn(() => {}),
  unitData: null,
  yearSelection: {
    "7": {
      subject: null,
      domain: null,
      tier: null,
      subjectCategory: { id: -1, title: "All" },
    },
    "8": {
      subject: null,
      domain: null,
      tier: null,
      subjectCategory: { id: -1, title: "All" },
    },
    "9": {
      subject: null,
      domain: null,
      tier: null,
      subjectCategory: { id: -1, title: "All" },
    },
    "10": {
      subject: null,
      domain: null,
      tier: null,
      subjectCategory: { id: -1, title: "All" },
    },
    "11": {
      subject: null,
      domain: null,
      tier: null,
      subjectCategory: { id: -1, title: "All" },
    },
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
  setVisibleMobileYearRefID: vi.fn(() => {}),
};

describe("visualiser", () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
    vi.clearAllMocks();
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
