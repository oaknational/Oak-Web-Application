import userEvent from "@testing-library/user-event";
import { act, waitFor } from "@testing-library/react";

import UnitsTab, { createProgrammeSlug } from "./UnitsTab";

import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";
import curriculumUnitsFormattedDataFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnitsYearData.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();
const curriculumThreadHighlighted = jest.fn();
const yearGroupSelected = jest.fn();
const unitInformationViewed = jest.fn();
const fixtureUnitLength = 87;

const primaryEnglishData = {
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
      lessons: [],
      order: 1,
      phase: "Primary",
      phase_slug: "primary",
      slug: "word-class",
      subject: "English",
      subject_parent: null,
      subject_parent_slug: null,
      subject_slug: "english",
      tags: null,
      threads: [],
      tier: null,
      tier_slug: null,
      title: "Word Class",
      unit_options: [],
      year: "1",
    },
    {
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
      order: 1,
      phase: "Primary",
      phase_slug: "primary",
      planned_number_of_lessons: 24,
      slug: "pandas-or-antarctic-animals-non-chronological-report",
      subject: "English",
      subject_parent: null,
      subject_parent_slug: null,
      subject_slug: "english",
      tags: null,
      threads: [],
      tier: null,
      tier_slug: null,
      title: "Pandas or Antarctic Animals: Non-Chronological Report",
      unit_options: [
        {
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          lessons: [],
          title: "Antarctic Animals",
          unitvariant_id: 774,
        },
        {
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          lessons: [],
          title: "Pandas",
          unitvariant_id: 773,
        },
      ],
      year: "6",
    },
  ],
};

const primaryEnglishFormattedData = {
  yearData: {
    1: {
      childSubjects: [],
      disciplines: [],
      units: primaryEnglishData.units,
      // units: [
      //   {
      //     planned_number_of_lessons: 8,
      //     domain: "Grammar",
      //     domain_id: 17,
      //     connection_future_unit_description: null,
      //     connection_prior_unit_description: null,
      //     connection_future_unit_title: null,
      //     connection_prior_unit_title: null,
      //     examboard: null,
      //     examboard_slug: null,
      //     keystage_slug: "ks1",
      //     lessons: [],
      //     order: 1,
      //     phase: "Primary",
      //     phase_slug: "primary",
      //     slug: "word-class",
      //     subject: "English",
      //     subject_parent: null,
      //     subject_parent_slug: null,
      //     subject_slug: "english",
      //     tags: null,
      //     threads: [],
      //     tier: null,
      //     tier_slug: null,
      //     title: "Word Class",
      //     unit_options: [],
      //     year: "1",
      //   },
      //   {
      //     connection_future_unit_description: null,
      //     connection_prior_unit_description: null,
      //     connection_future_unit_title: null,
      //     connection_prior_unit_title: null,
      //     domain: "Reading, Writing & Oracy",
      //     domain_id: 16,
      //     examboard: null,
      //     examboard_slug: null,
      //     keystage_slug: "ks1",
      //     lessons: [],
      //     order: 1,
      //     phase: "Primary",
      //     phase_slug: "primary",
      //     planned_number_of_lessons: 24,
      //     slug: "pandas-or-antarctic-animals-non-chronological-report",
      //     subject: "English",
      //     subject_parent: null,
      //     subject_parent_slug: null,
      //     subject_slug: "english",
      //     tags: null,
      //     threads: [],
      //     tier: null,
      //     tier_slug: null,
      //     title: "Pandas or Antarctic Animals: Non-Chronological Report",
      //     unit_options: [
      //       {
      //         connection_future_unit_description: null,
      //         connection_prior_unit_description: null,
      //         connection_future_unit_title: null,
      //         connection_prior_unit_title: null,
      //         lessons: [],
      //         title: "Antarctic Animals",
      //         unitvariant_id: 774,
      //       },
      //       {
      //         connection_future_unit_description: null,
      //         connection_prior_unit_description: null,
      //         connection_future_unit_title: null,
      //         connection_prior_unit_title: null,
      //         lessons: [],
      //         title: "Pandas",
      //         unitvariant_id: 773,
      //       },
      //     ],
      //     year: "6",
      //   },
      // ],
      domains: [
        {
          domain: "Reading, writing & oracy",
          domain_id: 16,
        },
        { domain: "Grammar", domain_id: 16 },
      ],
      tiers: [],
    },
  },
  threadOptions: [
    {
      title: "Texts that inform",
      slug: "texts-that-inform",
      order: 4,
    },
  ],
  yearOptions: ["1", "6"],
  initialYearSelection: {
    "1": {
      subject: null,
      discipline: {
        id: -1,
        title: "All",
      },
      domain: {
        domain: "All",
        domain_id: 0,
      },
      tier: null,
    },
    "6": {
      subject: null,
      discipline: {
        id: -1,
        title: "All",
      },
      domain: {
        domain: "All",
        domain_id: 0,
      },
      tier: null,
    },
  },
};

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumThreadHighlighted,
      yearGroupSelected,
      unitInformationViewed: (...args: unknown[]) =>
        unitInformationViewed(...args),
    },
  }),
}));

describe("components/pages/CurriculumInfo/tabs/UnitsTab", () => {
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
  test("user can see the content", async () => {
    const { queryAllByTestId } = render(
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug={null}
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );
    expect(queryAllByTestId("units-heading")[0]).toBeInTheDocument();
    expect(queryAllByTestId("unit-card")[0]).toBeInTheDocument();
  });

  test("number of unit cards matches expected units", async () => {
    const { findAllByTestId } = render(
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug={null}
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );
    const unitCards = await findAllByTestId("unit-card");
    expect(unitCards).toHaveLength(curriculumUnitsTabFixture().units.length);
  });

  test("threads with duplicate orders sort alphabetically", async () => {
    // Some duplicate thread orders, expect sorting alphabetically by slug
    const { findAllByTestId } = render(
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug={null}
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
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
          lessons: [],
          order: 1,
          phase: "Primary",
          phase_slug: "primary",
          slug: "word-class",
          subject: "English",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "english",
          tags: null,
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
          lessons: [],
          order: 1,
          phase: "Primary",
          phase_slug: "primary",
          slug: "a-superhero-like-you-reading-and-writing",
          subject: "English",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "english",
          tier: null,
          tier_slug: null,
          tags: null,
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
    const { findAllByTestId } = render(
      <UnitsTab
        data={data}
        examboardSlug={null}
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );
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
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug={null}
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
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

  test("All the year group choices are visible", async () => {
    const { findByTestId, findAllByTestId } = render(
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug={null}
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
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
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug={null}
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
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

  test("duplicate units without examboard are filtered out", async () => {
    const data = {
      units: [
        {
          planned_number_of_lessons: 8,
          domain: null,
          domain_id: null,
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          examboard: "AQA",
          examboard_slug: "aqa",
          keystage_slug: "ks4",
          lessons: [],
          order: 1,
          phase: "Secondary",
          phase_slug: "secondary",
          slug: "modern-text-first-study",
          subject: "English",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "english",
          tags: null,
          threads: [],
          tier: null,
          tier_slug: null,
          title: "Modern text: first study",
          unit_options: [
            {
              connection_future_unit_description: null,
              connection_prior_unit_description: null,
              connection_future_unit_title: null,
              connection_prior_unit_title: null,
              lessons: [],
              title: "Animal Farm: the pigs and power",
              unitvariant_id: 774,
            },
            {
              connection_future_unit_description: null,
              connection_prior_unit_description: null,
              connection_future_unit_title: null,
              connection_prior_unit_title: null,
              lessons: [],
              title: "Leave Taking: a sense of belonging",
              unitvariant_id: 773,
            },
          ],
          year: "10",
        },
        {
          planned_number_of_lessons: 8,
          domain: null,
          domain_id: null,
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_title: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks4",
          lessons: [],
          order: 1,
          phase: "Secondary",
          phase_slug: "secondary",
          slug: "modern-text-first-study",
          subject: "English",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "english",
          tags: null,
          threads: [],
          tier: null,
          tier_slug: null,
          title: "Modern text: first study",
          unit_options: [
            {
              connection_future_unit_description: null,
              connection_prior_unit_description: null,
              connection_future_unit_title: null,
              connection_prior_unit_title: null,
              lessons: [],
              title: "Animal Farm: the pigs and power",
              unitvariant_id: 774,
            },
          ],
          year: "10",
        },
      ],
    };
    const { findByTestId, findAllByTestId } = render(
      <UnitsTab
        data={data}
        examboardSlug={"aqa"}
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );
    const unitCards = await findAllByTestId("unit-card");
    expect(unitCards).toHaveLength(1);
    const tag = await findByTestId("options-tag");
    expect(tag).toHaveTextContent("2");
  });

  test("user can highlight units by threads", async () => {
    const { queryByTestId, queryAllByTestId } = render(
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug={null}
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );
    const threads = queryAllByTestId("thread-radio");
    if (!threads[0]) {
      throw new Error("No thread option found");
    }
    await userEvent.click(threads[0]);
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

  test("user can filter by year group", async () => {
    const { queryAllByTestId, findAllByTestId } = render(
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug={null}
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );
    const yearOptions = queryAllByTestId("year-radio");
    if (!yearOptions[0]) {
      throw new Error("No year option found");
    }
    await userEvent.click(yearOptions[0]);
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
          lessons: [],
          order: 1,
          phase: "Secondary",
          phase_slug: "secondary",
          planned_number_of_lessons: 5,
          slug: "cellular-respiration-and-atp",
          subject: "Combined Science",
          subject_parent: "Science",
          subject_parent_slug: "science",
          subject_slug: "combined-science",
          tags: null,
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
          lessons: [],
          order: 1,
          phase: "Secondary",
          phase_slug: "secondary",
          planned_number_of_lessons: 5,
          slug: "nuclear-physics",
          subject: "Physics",
          subject_parent: "Science",
          subject_parent_slug: "science",
          subject_slug: "physics",
          tags: null,
          threads: [],
          tier: null,
          tier_slug: null,
          title: "Nuclear Physics",
          unit_options: [],
          year: "11",
        },
      ],
    };
    const { findAllByTestId } = render(
      <UnitsTab
        data={data}
        examboardSlug={"aqa"}
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );
    let unitCards = await findAllByTestId("unit-card");
    // Combined science is selected by default, so only 1 expected
    expect(unitCards).toHaveLength(1);
    const subjectButtons = await findAllByTestId("subject-button");
    expect(subjectButtons).toHaveLength(2);
    if (!subjectButtons[1]) {
      throw new Error("Missing second subject button");
    }
    userEvent.click(subjectButtons[1]);
    await waitFor(async () => {
      unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(1);
      expect(unitCards[0]).toHaveTextContent("Nuclear Physics");
    });
  });

  test.only("user can filter units by domain", async () => {
    const { findAllByTestId } = render(
      <UnitsTab
        data={primaryEnglishData}
        examboardSlug={null}
        formattedData={primaryEnglishFormattedData}
      />,
    );

    let unitCards = null;
    await act(async () => {
      unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(2);
    });

    const domainButtons = await findAllByTestId("domain-button");
    // When there are domains, "All" button is added, so 3 expected
    expect(domainButtons).toHaveLength(2);
    if (!domainButtons[1]) {
      throw new Error("Missing second domain button");
    }
    userEvent.click(domainButtons[1]);
    await waitFor(async () => {
      unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(2);
    });
  });

  test("user can filter units by discipline", async () => {
    const data = curriculumUnitsTabFixture();
    const { findAllByTestId, queryAllByTestId } = render(
      <UnitsTab
        data={data}
        examboardSlug={null}
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );

    const yearOptions = (await queryAllByTestId(
      "year-radio",
    )) as HTMLInputElement[];

    const year10Option = yearOptions.find((option) => option.value === "7");
    if (!year10Option) {
      throw new Error("No year 7 option found");
    }

    // Check we only have 27 units for year 10 to start with (combined science).
    await userEvent.click(year10Option);
    let unitCards;
    await waitFor(async () => {
      unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(14);
    });

    const disciplineButtons = await findAllByTestId("discipline-button");

    if (
      !disciplineButtons[0] ||
      !disciplineButtons[1] ||
      !disciplineButtons[2]
    ) {
      throw new Error("Missing second subject button");
    }

    expect(disciplineButtons[0]).toHaveTextContent("All");
    expect(disciplineButtons[1]).toHaveTextContent("Biology");
    expect(disciplineButtons[2]).toHaveTextContent("Chemistry");

    // Check we have 6 units after clicking the Biology button.
    await userEvent.click(disciplineButtons[1]);
    await waitFor(async () => {
      unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(6);
      const cellsUnit = data.units.filter((unit) => {
        const yearFilter = unit.year === "7";
        const disciplineFilter =
          unit.tags && unit.tags[0] && unit.tags[0]?.title === "Biology";

        return yearFilter && disciplineFilter;
      });

      if (!cellsUnit[0]) {
        throw new Error("No unit title in fixture");
      }
      expect(unitCards[0]).toHaveTextContent(cellsUnit[0].title);
    });

    // Check we have 4 units after clicking the Chemistry button.
    await userEvent.click(disciplineButtons[2]);
    await waitFor(async () => {
      unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(4);
    });

    // Check we have 2 units after clicking the All button.
    await userEvent.click(disciplineButtons[0]);
    await waitFor(async () => {
      unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(14);
    });
  });

  test("user can filter units by tier", async () => {
    const { findAllByTestId, findByTestId } = render(
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug="aqa"
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );
    let unitCards = await findAllByTestId("unit-card");
    // Foundation selected by default, so only 2 (including blank) expected for both sets of buttons for Year 10
    expect(unitCards).toHaveLength(fixtureUnitLength);

    // Find and click higher tier button for Y10
    const tierButtons = await findAllByTestId("tier-button-y10");
    expect(tierButtons).toHaveLength(2);

    if (!tierButtons[1]) {
      throw new Error("Missing higher tier button");
    }

    userEvent.click(tierButtons[1]);
    await waitFor(async () => {
      unitCards = await findAllByTestId("unit-card");
      expect(unitCards).toHaveLength(fixtureUnitLength);

      // find a higher unit - atomic structure and the periodic table
      const higherUnitInfoButton = await findByTestId(
        "unit-info-button-eukaryotic-and-prokaryotic-cells-higher",
      );

      expect(higherUnitInfoButton).toBeInTheDocument();
    });
  });

  test("user can see correct number of unit options", async () => {
    const { findByTestId } = render(
      <UnitsTab
        data={primaryEnglishData}
        examboardSlug={null}
        formattedData={primaryEnglishFormattedData}
      />,
    );
    const tag = await findByTestId("options-tag");
    expect(tag).toHaveTextContent("2");
  });

  describe("programme slugs are created correctly", () => {
    test("unit data with exam board returns the correct programme slug", () => {
      const unitData = {
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
        lessons: [],
        order: 1,
        phase: "Secondary",
        phase_slug: "secondary",
        slug: "cellular-respiration-and-atp",
        subject: "Combined Science",
        subject_parent: "Science",
        subject_parent_slug: "science",
        subject_slug: "combined-science",
        tags: null,
        threads: [],
        tier: "Foundation",
        tier_slug: "foundation",
        title: "Aerobic and anaerobic cellular respiration",
        unit_options: [],
        year: "11",
      };
      expect(createProgrammeSlug(unitData, "aqa")).toEqual(
        "combined-science-secondary-ks4-foundation-aqa",
      );
    });
    test("unit data for ks3 returns the correct programme slug", () => {
      const unitData = {
        planned_number_of_lessons: 5,
        connection_future_unit_description: null,
        connection_prior_unit_description: null,
        connection_future_unit_title: null,
        connection_prior_unit_title: null,
        domain: null,
        domain_id: null,
        examboard: null,
        examboard_slug: null,
        keystage_slug: "ks3",
        lessons: [],
        order: 1,
        phase: "Secondary",
        phase_slug: "secondary",
        slug: "cellular-respiration-and-atp",
        subject: "Combined Science",
        subject_parent: "Science",
        subject_parent_slug: "science",
        subject_slug: "combined-science",
        tags: null,
        threads: [],
        tier: "Foundation",
        tier_slug: "foundation",
        title: "Aerobic and anaerobic cellular respiration",
        unit_options: [],
        year: "9",
      };
      expect(createProgrammeSlug(unitData, "aqa")).toEqual(
        "combined-science-secondary-ks3",
      );
    });
  });

  const resizeWindow = (x: number, y: number) => {
    window.innerWidth = x;
    window.innerHeight = y;
    window.dispatchEvent(new Event("resize"));
  };

  test("mobile: highlighting threads updates the number of threads highlighted", async () => {
    resizeWindow(390, 844);

    const { findByTestId, findAllByTestId } = render(
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug="aqa"
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );
    // Open thread modal
    const filterThreadsButton = await findByTestId("mobile-highlight-thread");
    await userEvent.click(filterThreadsButton);

    const threadRadios = await findAllByTestId("thread-radio-mobile");
    const doneButton = await findByTestId("mobile-done-thread-modal-button");
    const livingThingsThread = threadRadios[0];
    if (livingThingsThread && doneButton) {
      // Select the first thread
      await userEvent.click(livingThingsThread);
      await userEvent.click(doneButton);

      const highlightedThreadsBox = await findByTestId(
        "highlighted-threads-mobile",
      );
      const highlightedUnitsBox = await findByTestId(
        "highlighted-units-box-mobile",
      );
      expect(highlightedThreadsBox).toBeInTheDocument();
      expect(highlightedThreadsBox).toHaveTextContent(
        "BQ01 Biology: What are living things and what are they made of?",
      );
      expect(highlightedUnitsBox).toHaveTextContent("16 units highlighted");
    }
  });
  test("mobile: mobile filter options visible", async () => {
    resizeWindow(390, 844);

    const { findByTestId, findAllByTestId } = render(
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug="aqa"
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );
    const mobileThreadButton = await findByTestId("mobile-highlight-thread");
    const mobileYearFilter = await findByTestId("year-selection-mobile");
    const mobileYearFilterButtons = await findAllByTestId(
      "year-group-filter-button",
    );
    expect(mobileThreadButton).toBeInTheDocument();
    expect(mobileYearFilter).toBeInTheDocument();
    expect(mobileYearFilterButtons).toHaveLength(5);
  });
  test("desktop filters are not visible in mobile", async () => {
    resizeWindow(390, 844);

    const { findByTestId } = render(
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug="aqa"
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );

    const yearsRadio = await findByTestId("year-group-filter-desktop");
    expect(yearsRadio).toHaveStyle({ display: "none" });

    const threadsFilter = await findByTestId("threads-filter-desktop");
    expect(threadsFilter).toHaveStyle({ display: "none" });
  });

  test("mobile: anchor links for year group filters match", async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
    resizeWindow(390, 844);

    const { findAllByTestId } = render(
      <UnitsTab
        data={curriculumUnitsTabFixture()}
        examboardSlug="aqa"
        formattedData={curriculumUnitsFormattedDataFixture()}
      />,
    );

    const yearFilterButtons = await findAllByTestId("year-group-filter-button");
    const yearHeadings = await findAllByTestId("year-heading");
    const year2Button = yearFilterButtons[1];
    if (year2Button) {
      await userEvent.click(year2Button);
      // Selected button background colour should change
      waitFor(() => {
        expect(year2Button).toHaveStyle("background-color: rgb(34, 34, 34);");
        // Unselected button background colour shouldn't change
        expect(yearFilterButtons[0]).toHaveStyle(
          "background-color: rgb(242, 242, 242);",
        );
        expect(year2Button).toHaveTextContent("Year 2");
        expect(yearHeadings[1]).toHaveTextContent("Year 2");
      });
    }
  });
});
