import userEvent from "@testing-library/user-event";
import { act, waitFor } from "@testing-library/react";

import UnitsTab from "./UnitsTab";

import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();
const curriculumThreadHighlighted = jest.fn();
const yearGroupSelected = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumThreadHighlighted: (...args: unknown[]) =>
        curriculumThreadHighlighted(...args),
      yearGroupSelected: (...args: unknown[]) => yearGroupSelected(...args),
    },
  }),
}));

describe("components/pages/CurriculumInfo/tabs/UnitsTab", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("user can see the content", async () => {
    const { queryAllByTestId } = render(
      <UnitsTab data={curriculumUnitsTabFixture()} />,
    );
    expect(queryAllByTestId("units-heading")[0]).toBeInTheDocument();
    expect(queryAllByTestId("unit-card")[0]).toBeInTheDocument();
  });

  test("number of unit cards matches units", async () => {
    const { findAllByTestId } = render(
      <UnitsTab data={curriculumUnitsTabFixture()} />,
    );
    const unitCards = await findAllByTestId("unit-card");
    expect(unitCards).toHaveLength(curriculumUnitsTabFixture().units.length);
  });

  test("threads with duplicate orders sort alphabetically", async () => {
    // Some duplicate thread orders, expect sorting alphabetically by slug
    const { findAllByTestId } = render(
      <UnitsTab data={curriculumUnitsTabFixture()} />,
    );
    const threadOptions = await findAllByTestId("thread-radio");
    const isSorted = threadOptions
      .map((option) => String(option.getAttribute("value")))
      .every(
        (key, index, array) =>
          index === 0 || String(array[index - 1]).localeCompare(key) <= 0,
      );
    expect(isSorted).toBe(true);
  });

  test("threads with unique orders sort by order", async () => {
    const data = {
      units: [
        {
          planned_number_of_lessons: 8,
          domain: "Grammar",
          domain_id: 17,
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks1",
          lessons: [
            { title: "Lesson 1", slug: "lesson-1", order: 1 },
            { title: "Lesson 2", slug: "lesson-2", order: 2 },
            { title: "Lesson 3", slug: "lesson-3", order: 3 },
            { title: "Lesson 4", slug: "lesson-4", order: 4 },
            { title: "Lesson 5", slug: "lesson-5", order: 5 },
            { title: "Lesson 6", slug: "lesson-6", order: 6 },
            { title: "Lesson 7", slug: "lesson-7", order: 7 },
            { title: "Lesson 8", slug: "lesson-8", order: 8 },
          ],
          phase: "Primary",
          phase_slug: "primary",
          slug: "word-class",
          subject: "English",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "english",
          threads: [
            {
              title: "Developing grammatical knowledge",
              slug: "developing-grammatical-knowledge",
              order: 10,
            },
          ],
          tier: null,
          tier_slug: null,
          title: "Word Class",
          unit_options: [],
          year: "1",
        },
        {
          planned_number_of_lessons: 8,
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          domain: "Reading, Writing & Oracy",
          domain_id: 16,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks1",
          lessons: [
            { title: "Lesson 1", slug: "lesson-1", order: 1 },
            { title: "Lesson 2", slug: "lesson-2", order: 2 },
            { title: "Lesson 3", slug: "lesson-3", order: 3 },
            { title: "Lesson 4", slug: "lesson-4", order: 4 },
            { title: "Lesson 5", slug: "lesson-5", order: 5 },
            { title: "Lesson 6", slug: "lesson-6", order: 6 },
            { title: "Lesson 7", slug: "lesson-7", order: 7 },
            { title: "Lesson 8", slug: "lesson-8", order: 8 },
          ],
          phase: "Primary",
          phase_slug: "primary",
          slug: "a-superhero-like-you-reading-and-writing",
          subject: "English",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "english",
          tier: null,
          tier_slug: null,
          threads: [
            {
              title: "Aspiration",
              slug: "aspiration",
              order: 8,
            },
            {
              title: "Aspects of narrative",
              slug: "aspects-of-narrative",
              order: 2,
            },
          ],
          title: "’A Superhero Like You!’: Reading and Writing",
          unit_options: [],
          year: "1",
        },
      ],
    };
    const { findAllByTestId } = render(<UnitsTab data={data} />);
    const threadOptions = await findAllByTestId("thread-radio");
    expect(threadOptions).toHaveLength(3);
    expect(threadOptions.map((option) => option.getAttribute("value"))).toEqual(
      [
        "aspects-of-narrative",
        "aspiration",
        "developing-grammatical-knowledge",
      ],
    );
  });

  test("user can see all the thread choices", async () => {
    const { findByTestId, findAllByTestId } = render(
      <UnitsTab data={curriculumUnitsTabFixture()} />,
    );
    expect(await findByTestId("no-threads-radio")).toBeInTheDocument();
    const threads = await findAllByTestId("thread-radio");
    const threadSet = new Set();
    curriculumUnitsTabFixture().units.forEach((unit) => {
      unit.threads.forEach((thread) => {
        threadSet.add(thread.slug);
      });
    });
    expect(threads).toHaveLength(threadSet.size);
  });

  test("user can highlight units by threads", async () => {
    const { queryByTestId, queryAllByTestId } = render(
      <UnitsTab data={curriculumUnitsTabFixture()} />,
    );
    const threads = queryAllByTestId("thread-radio");
    await act(async () => {
      if (!threads[0]) {
        throw new Error("No thread option found");
      }
      await userEvent.click(threads[0]);
    });
    const threadUnits = curriculumUnitsTabFixture().units.filter((unit) => {
      return unit.threads.some(
        (thread) => thread.slug === threads[0]?.getAttribute("value"),
      );
    });
    const highlightedUnits = queryAllByTestId("highlighted-unit-card");
    expect(threadUnits).toHaveLength(highlightedUnits.length);
    const selectedThread = queryByTestId("selected-thread-radio");
    expect(selectedThread).toBeInTheDocument();
  });

  test("user can see all the year group choices", async () => {
    const { findByTestId, findAllByTestId } = render(
      <UnitsTab data={curriculumUnitsTabFixture()} />,
    );
    expect(await findByTestId("all-years-radio")).toBeInTheDocument();
    const yearOptions = await findAllByTestId("year-radio");
    const yearSet = new Set(
      curriculumUnitsTabFixture().units.map((unit) => unit.year),
    );
    expect(yearOptions).toHaveLength(yearSet.size);
  });

  test("Year group choices are properly sorted", async () => {
    const { findAllByTestId } = render(
      <UnitsTab data={curriculumUnitsTabFixture()} />,
    );
    const yearOptions = await findAllByTestId("year-radio");
    const extractedYears = yearOptions.map((option) =>
      parseInt(option.getAttribute("value") || "0"),
    );
    const isSorted = extractedYears.every((year, index, array) => {
      return index === 0 || Number(array[index - 1]) <= year;
    });
    expect(isSorted).toBe(true);
  });

  test("user can filter by year group", async () => {
    const { queryAllByTestId, findAllByTestId } = render(
      <UnitsTab data={curriculumUnitsTabFixture()} />,
    );
    const yearOptions = queryAllByTestId("year-radio");
    await act(async () => {
      if (!yearOptions[0]) {
        throw new Error("No year option found");
      }
      await userEvent.click(yearOptions[0]);
    });
    const headings = await findAllByTestId("year-heading");
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(
      String(yearOptions[0]?.getAttribute("value")),
    );
  });

  test("user can filter units by parent subject", async () => {
    const data = {
      units: [
        {
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          domain: null,
          domain_id: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks4",
          lessons: [
            { title: "Lesson 1", slug: "lesson-1", order: 1 },
            { title: "Lesson 2", slug: "lesson-2", order: 2 },
            { title: "Lesson 3", slug: "lesson-3", order: 3 },
            { title: "Lesson 4", slug: "lesson-4", order: 4 },
            { title: "Lesson 5", slug: "lesson-5", order: 5 },
          ],
          phase: "Secondary",
          phase_slug: "secondary",
          planned_number_of_lessons: 5,
          slug: "cellular-respiration-and-atp",
          subject: "Combined Science",
          subject_parent: "Science",
          subject_parent_slug: "science",
          subject_slug: "combined-science",
          threads: [],
          tier: null,
          tier_slug: null,
          title: "Aerobic and anaerobic cellular respiration",
          unit_options: [],
          year: "11",
        },
        {
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          domain: null,
          domain_id: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks4",
          lessons: [
            { title: "Lesson 1", slug: "lesson-1", order: 1 },
            { title: "Lesson 2", slug: "lesson-2", order: 2 },
            { title: "Lesson 3", slug: "lesson-3", order: 3 },
            { title: "Lesson 4", slug: "lesson-4", order: 4 },
            { title: "Lesson 5", slug: "lesson-5", order: 5 },
          ],
          phase: "Secondary",
          phase_slug: "secondary",
          planned_number_of_lessons: 5,
          slug: "nuclear-physics",
          subject: "Physics",
          subject_parent: "Science",
          subject_parent_slug: "science",
          subject_slug: "physics",
          threads: [],
          tier: null,
          tier_slug: null,
          title: "Nuclear Physics",
          unit_options: [],
          year: "11",
        },
      ],
    };
    const { findAllByTestId } = render(<UnitsTab data={data} />);
    let unitCards = await findAllByTestId("unit-card");
    // Combined science is selected by default, so only 1 expected
    expect(unitCards).toHaveLength(1);
    const subjectButtons = await findAllByTestId("subject-button");
    expect(subjectButtons).toHaveLength(2);
    await act(async () => {
      if (!subjectButtons[1]) {
        throw new Error("Missing second subject button");
      }
      userEvent.click(subjectButtons[1]);
    });
    await waitFor(async () => {
      unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(1);
      expect(unitCards[0]).toHaveTextContent("Nuclear Physics");
    });
  });

  test("user can filter units by domain", async () => {
    const data = {
      units: [
        {
          planned_number_of_lessons: 8,
          domain: "Grammar",
          domain_id: 17,
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks1",
          lessons: [
            { title: "Lesson 1", slug: "lesson-1", order: 1 },
            { title: "Lesson 2", slug: "lesson-2", order: 2 },
            { title: "Lesson 3", slug: "lesson-3", order: 3 },
            { title: "Lesson 4", slug: "lesson-4", order: 4 },
            { title: "Lesson 5", slug: "lesson-5", order: 5 },
            { title: "Lesson 6", slug: "lesson-6", order: 6 },
            { title: "Lesson 7", slug: "lesson-7", order: 7 },
            { title: "Lesson 8", slug: "lesson-8", order: 8 },
          ],
          phase: "Primary",
          phase_slug: "primary",
          slug: "word-class",
          subject: "English",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "english",
          threads: [],
          tier: null,
          tier_slug: null,
          title: "Word Class",
          unit_options: [],
          year: "1",
        },
        {
          planned_number_of_lessons: 8,
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          domain: "Reading, Writing & Oracy",
          domain_id: 16,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks1",
          lessons: [],
          phase: "Primary",
          phase_slug: "primary",
          slug: "a-superhero-like-you-reading-and-writing",
          subject: "English",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "english",
          tier: null,
          tier_slug: null,
          threads: [],
          title: "’A Superhero Like You!’: Reading and Writing",
          unit_options: [],
          year: "1",
        },
      ],
    };
    const { findAllByTestId } = render(<UnitsTab data={data} />);
    let unitCards = await findAllByTestId("unit-card");
    expect(unitCards).toHaveLength(2);
    const domainButtons = await findAllByTestId("domain-button");
    // When there are domains, "All" button is added, so 3 expected
    expect(domainButtons).toHaveLength(3);
    await act(async () => {
      if (!domainButtons[1]) {
        throw new Error("Missing second domain button");
      }
      userEvent.click(domainButtons[1]);
    });
    await waitFor(async () => {
      unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(1);
    });
  });

  test("user can filter units by tier", async () => {
    const data = {
      units: [
        {
          planned_number_of_lessons: 5,
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          domain: null,
          domain_id: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks4",
          lessons: [
            { title: "Lesson 1", slug: "lesson-1", order: 1 },
            { title: "Lesson 2", slug: "lesson-2", order: 2 },
            { title: "Lesson 3", slug: "lesson-3", order: 3 },
            { title: "Lesson 4", slug: "lesson-4", order: 4 },
            { title: "Lesson 5", slug: "lesson-5", order: 5 },
          ],
          phase: "Secondary",
          phase_slug: "secondary",
          slug: "cellular-respiration-and-atp",
          subject: "Combined Science",
          subject_parent: "Science",
          subject_parent_slug: "science",
          subject_slug: "combined-science",
          threads: [],
          tier: "Foundation",
          tier_slug: "foundation",
          title: "Aerobic and anaerobic cellular respiration",
          unit_options: [],
          year: "11",
        },
        {
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          domain: null,
          domain_id: null,
          threads: [],
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks4",
          lessons: [
            { title: "Lesson 1", slug: "lesson-1", order: 1 },
            { title: "Lesson 2", slug: "lesson-2", order: 2 },
            { title: "Lesson 3", slug: "lesson-3", order: 3 },
            { title: "Lesson 4", slug: "lesson-4", order: 4 },
            { title: "Lesson 5", slug: "lesson-5", order: 5 },
          ],
          phase: "Secondary",
          phase_slug: "secondary",
          planned_number_of_lessons: 5,
          slug: "nuclear-physics",
          subject: "Combined Science",
          subject_parent: "Science",
          subject_parent_slug: "science",
          subject_slug: "combined-science",
          tier: "Higher",
          tier_slug: "higher",
          title: "Nuclear Physics",
          unit_options: [],
          year: "11",
        },
        {
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          domain: null,
          domain_id: null,
          threads: [],
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks4",
          lessons: [
            { title: "Lesson 1", slug: "lesson-1", order: 1 },
            { title: "Lesson 2", slug: "lesson-2", order: 2 },
            { title: "Lesson 3", slug: "lesson-3", order: 3 },
            { title: "Lesson 4", slug: "lesson-4", order: 4 },
            { title: "Lesson 5", slug: "lesson-5", order: 5 },
          ],
          phase: "Secondary",
          phase_slug: "secondary",
          planned_number_of_lessons: 5,
          slug: "industrial-chemistry",
          subject: "Combined Science",
          subject_parent: "Science",
          subject_parent_slug: "science",
          subject_slug: "combined-science",
          tier: null,
          tier_slug: null,
          title: "Industrial Chemistry",
          unit_options: [],
          year: "11",
        },
      ],
    };
    const { findAllByTestId } = render(<UnitsTab data={data} />);
    let unitCards = await findAllByTestId("unit-card");
    // Foundation selected by default, so only 2 (including blank) expected
    expect(unitCards).toHaveLength(2);
    const tierButtons = await findAllByTestId("tier-button");
    expect(tierButtons).toHaveLength(2);
    await act(async () => {
      if (!tierButtons[1]) {
        throw new Error("Missing second subject button");
      }
      userEvent.click(tierButtons[1]);
    });
    await waitFor(async () => {
      unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(2);
      expect(unitCards[0]).toHaveTextContent("Nuclear Physics");
    });
  });

  test("user can see correct number of unit options", async () => {
    const data = {
      units: [
        {
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          domain: "Reading, Writing & Oracy",
          domain_id: 16,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks2",
          lessons: [
            { title: "Lesson 1", slug: "lesson-1", order: 1 },
            { title: "Lesson 2", slug: "lesson-2", order: 2 },
            { title: "Lesson 3", slug: "lesson-3", order: 3 },
          ],
          phase: "Primary",
          phase_slug: "primary",
          planned_number_of_lessons: 24,
          slug: "pandas-or-antarctic-animals-non-chronological-report",
          subject: "English",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "english",
          threads: [],
          tier: null,
          tier_slug: null,
          title: "Pandas or Antarctic Animals: Non-Chronological Report",
          unit_options: [
            {
              connection_future_unit_description: null,
              connection_prior_unit_description: null,
              lessons: [
                { title: "Lesson 1", slug: "lesson-1", order: 1 },
                { title: "Lesson 2", slug: "lesson-2", order: 2 },
              ],
              title: "Antarctic Animals",
              unitvariant_id: 774,
            },
            {
              connection_future_unit_description: null,
              connection_prior_unit_description: null,
              connection_future_unit_title: null,
              connection_prior_unit_title: null,
              lessons: [
                { title: "Lesson 1", slug: "lesson-1", order: 1 },
                { title: "Lesson 2", slug: "lesson-2", order: 2 },
              ],
              title: "Pandas",
              unitvariant_id: 773,
            },
          ],
          year: "6",
        },
      ],
    };
    const { findByTestId } = render(<UnitsTab data={data} />);
    const tag = await findByTestId("options-tag");
    expect(tag).toHaveTextContent("2");
  });
});
