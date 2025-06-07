import { render } from "@testing-library/react";
import React from "react";

import { formatCurriculumUnitsData } from "../../../pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumFilters } from "../../../utils/curriculum/types";

import UnitsTab from "./UnitsTab";

// import userEvent from "@testing-library/user-event";
// import { waitFor } from "@testing-library/react";

// import UnitsTab from "./UnitsTab";

// import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";
// import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

// const render = renderWithProviders();

// const trackingDataSecondaryScience = {
//   subjectTitle: "Science",
//   subjectSlug: "science",
//   ks4OptionSlug: "aqa",
//   phaseSlug: "secondary",
// };
// const secondaryScienceUnits = {
//   units: [
//     {
//       connection_future_unit_description: null,
//       connection_prior_unit_description: null,
//       connection_future_unit_title: null,
//       connection_prior_unit_title: null,
//       domain: null,
//       domain_id: null,
//       examboard: null,
//       examboard_slug: null,
//       keystage_slug: "ks4",
//       lessons: [],
//       order: 1,
//       phase: "Secondary",
//       phase_slug: "secondary",
//       planned_number_of_lessons: 5,
//       slug: "cellular-respiration-and-atp",
//       subject: "Combined Science",
//       subject_parent: "Science",
//       subject_parent_slug: "science",
//       subject_slug: "combined-science",
//       tags: null,
//       subjectcategories: null,
//       threads: [],
//       tier: null,
//       tier_slug: null,
//       title: "Aerobic and anaerobic cellular respiration",
//       unit_options: [],
//       year: "11",
//       cycle: "1",
//       why_this_why_now: null,
//       description: null,
//       state: "published",
//     },
//     {
//       connection_future_unit_description: null,
//       connection_prior_unit_description: null,
//       connection_future_unit_title: null,
//       connection_prior_unit_title: null,
//       domain: null,
//       domain_id: null,
//       examboard: null,
//       examboard_slug: null,
//       keystage_slug: "ks4",
//       lessons: [],
//       order: 1,
//       phase: "Secondary",
//       phase_slug: "secondary",
//       planned_number_of_lessons: 5,
//       slug: "nuclear-physics",
//       subject: "Physics",
//       subject_parent: "Science",
//       subject_parent_slug: "science",
//       subject_slug: "physics",
//       tags: null,
//       subjectcategories: null,
//       threads: [],
//       tier: null,
//       tier_slug: null,
//       title: "Nuclear Physics",
//       unit_options: [],
//       year: "11",
//       cycle: "1",
//       why_this_why_now: null,
//       description: null,
//       state: "published",
//     },
//   ],
// };

// const trackingDataPrimaryEnglish = {
//   subjectTitle: "English",
//   subjectSlug: "english",
//   ks4OptionSlug: null,
//   phaseSlug: "primary",
// };
// const primaryEnglishData = {
//   units: [
//     {
//       planned_number_of_lessons: 8,
//       domain: "Grammar",
//       domain_id: 17,
//       connection_future_unit_description: null,
//       connection_prior_unit_description: null,
//       connection_future_unit_title: null,
//       connection_prior_unit_title: null,
//       examboard: null,
//       examboard_slug: null,
//       keystage_slug: "ks2",
//       lessons: [],
//       order: 1,
//       phase: "Primary",
//       phase_slug: "primary",
//       slug: "using-five-sentence-types",
//       subject: "English",
//       subject_parent: null,
//       subject_parent_slug: null,
//       subject_slug: "english",
//       tags: null,
//       subjectcategories: null,
//       threads: [
//         {
//           title: "Developing grammatical knowledge",
//           slug: "developing-grammatical-knowledge",
//           order: 10,
//         },
//       ],
//       childSubjects: [],
//       tier: null,
//       tier_slug: null,
//       title: "Using five sentence types",
//       unit_options: [],
//       year: "6",
//       cycle: "1",
//       why_this_why_now: null,
//       description: null,
//       state: "published",
//     },
//     {
//       connection_future_unit_description: null,
//       connection_prior_unit_description: null,
//       connection_future_unit_title: null,
//       connection_prior_unit_title: null,
//       domain: "Reading, Writing & Oracy",
//       domain_id: 16,
//       examboard: null,
//       examboard_slug: null,
//       keystage_slug: "ks2",
//       lessons: [],
//       order: 1,
//       phase: "Primary",
//       phase_slug: "primary",
//       planned_number_of_lessons: 24,
//       slug: "pandas-or-antarctic-animals-non-chronological-report",
//       subject: "English",
//       subject_parent: null,
//       subject_parent_slug: null,
//       subject_slug: "english",
//       tags: null,
//       subjectcategories: null,
//       threads: [
//         {
//           title: "Texts that inform",
//           slug: "texts-that-inform",
//           order: 4,
//         },
//       ],
//       childSubjects: [],
//       tier: null,
//       tier_slug: null,
//       title: "Pandas or Antarctic Animals: Non-Chronological Report",
//       unit_options: [
//         {
//           connection_future_unit_description: null,
//           connection_prior_unit_description: null,
//           connection_future_unit_title: null,
//           connection_prior_unit_title: null,
//           lessons: [],
//           title: "Antarctic Animals",
//           unitvariant_id: 774,
//           why_this_why_now: null,
//           description: null,
//           state: "published",
//         },
//         {
//           connection_future_unit_description: null,
//           connection_prior_unit_description: null,
//           connection_future_unit_title: null,
//           connection_prior_unit_title: null,
//           lessons: [],
//           title: "Pandas",
//           unitvariant_id: 773,
//           why_this_why_now: null,
//           description: null,
//           state: "published",
//         },
//       ],
//       year: "6",
//       cycle: "1",
//       why_this_why_now: null,
//       description: null,
//       state: "published",
//     },
//   ],
// };

describe("unitsTab !subject error", () => {
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

  test("throws error when subject is not found in curriculumPhaseOptions", () => {
    const mockTrackingData = {
      subjectTitle: "English",
      subjectSlug: "english",
      ks4OptionSlug: null,
      phaseSlug: "primary",
    };

    const mockFormattedData = formatCurriculumUnitsData({
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
          keystage_slug: "ks2",
          lessons: [],
          order: 1,
          phase: "Primary",
          phase_slug: "primary",
          slug: "test-unit",
          subject: "English",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "english",
          tags: null,
          subjectcategories: null,
          threads: [],
          tier: null,
          tier_slug: null,
          title: "Test Unit",
          unit_options: [],
          year: "6",
          cycle: "1",
          why_this_why_now: null,
          description: null,
          state: "published",
          prior_knowledge_requirements: [],
        },
      ],
    });

    const mockFilters: CurriculumFilters = {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
      pathways: [],
    };

    const mockSlugs = {
      subjectSlug: "nonexistent-subject",
      phaseSlug: "primary",
      ks4OptionSlug: null,
    };

    const mockCurriculumPhaseOptions = {
      subjects: [
        {
          title: "Mathematics",
          slug: "mathematics",
          keystages: [{ slug: "ks2", title: "KS2" }],
          phases: [],
          ks4_options: [],
        },
      ],
    };

    expect(() => {
      render(
        <UnitsTab
          basePath="/"
          trackingData={mockTrackingData}
          formattedData={mockFormattedData}
          filters={mockFilters}
          onChangeFilters={() => {}}
          slugs={mockSlugs}
          ks4Options={[]}
          curriculumPhaseOptions={mockCurriculumPhaseOptions}
        />,
      );
    }).toThrow(
      "Selected subject not found in curriculumPhaseOptions for UnitsTab",
    );
  });

  // it("placeholder", () => {});
  // test("user can see the content", async () => {
  //   const { queryAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(curriculumUnitsTabFixture())} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: [],
  //         threads: []
  //       }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //         throw new Error("Function not implemented.");
  //       } }      />,
  //   );
  //   expect(queryAllByTestId("units-heading")[0]).toBeInTheDocument();
  //   expect(queryAllByTestId("unit-card")[0]).toBeInTheDocument();
  // });

  // test("number of unit cards matches expected units", async () => {
  //   const { findAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(curriculumUnitsTabFixture())} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: [],
  //         threads: []
  //       }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //         throw new Error("Function not implemented.");
  //       } }      />,
  //   );
  //   const unitCards = await findAllByTestId("unit-card");

  //   // Not sure if this number hasn't been properly checked. It's a bit like a snapshot, I'm going to leave it as is so that if it changes unexpectedly it is picked up.
  //   const VISIBLE_UNITS = 87;
  //   expect(unitCards).toHaveLength(VISIBLE_UNITS);
  // });

  // test("threads with duplicate orders sort alphabetically", async () => {
  //   // Some duplicate thread orders, expect sorting alphabetically by slug
  //   const { findAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(curriculumUnitsTabFixture())} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: [],
  //         threads: []
  //       }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //         throw new Error("Function not implemented.");
  //       } }      />,
  //   );
  //   const threadOptions = await findAllByTestId("thread-radio");
  //   const isSorted = threadOptions
  //     .map((option) => String(option.getAttribute("value")))
  //     .every(
  //       (key, index, array) =>
  //         index === 0 || String(array[index - 1]).localeCompare(key) <= 0,
  //     );
  //   expect(isSorted).toBe(true);
  // });

  // test("threads with unique orders sort by order", async () => {
  //   const data = {
  //     units: [
  //       {
  //         planned_number_of_lessons: 8,
  //         domain: "Grammar",
  //         domain_id: 17,
  //         connection_future_unit_description: null,
  //         connection_prior_unit_description: null,
  //         connection_future_unit_title: null,
  //         connection_prior_unit_title: null,
  //         examboard: null,
  //         examboard_slug: null,
  //         keystage_slug: "ks1",
  //         lessons: [],
  //         order: 1,
  //         phase: "Primary",
  //         phase_slug: "primary",
  //         slug: "word-class",
  //         subject: "English",
  //         subject_parent: null,
  //         subject_parent_slug: null,
  //         subject_slug: "english",
  //         tags: null,
  //         subjectcategories: null,
  //         threads: [
  //           {
  //             title: "Developing grammatical knowledge",
  //             slug: "developing-grammatical-knowledge",
  //             order: 10,
  //           },
  //         ],
  //         tier: null,
  //         tier_slug: null,
  //         title: "Word Class",
  //         unit_options: [],
  //         year: "1",
  //         cycle: "1",
  //         why_this_why_now: null,
  //         description: null,
  //         state: "published",
  //       },
  //       {
  //         planned_number_of_lessons: 8,
  //         connection_future_unit_description: null,
  //         connection_prior_unit_description: null,
  //         connection_future_unit_title: null,
  //         connection_prior_unit_title: null,
  //         domain: "Reading, Writing & Oracy",
  //         domain_id: 16,
  //         examboard: null,
  //         examboard_slug: null,
  //         keystage_slug: "ks1",
  //         lessons: [],
  //         order: 1,
  //         phase: "Primary",
  //         phase_slug: "primary",
  //         slug: "a-superhero-like-you-reading-and-writing",
  //         subject: "English",
  //         subject_parent: null,
  //         subject_parent_slug: null,
  //         subject_slug: "english",
  //         tier: null,
  //         tier_slug: null,
  //         tags: null,
  //         subjectcategories: null,
  //         threads: [
  //           {
  //             title: "Aspiration",
  //             slug: "aspiration",
  //             order: 8,
  //           },
  //           {
  //             title: "Aspects of narrative",
  //             slug: "aspects-of-narrative",
  //             order: 2,
  //           },
  //         ],
  //         title: "'A Superhero Like You!' Reading and Writing",
  //         unit_options: [],
  //         year: "1",
  //         cycle: "1",
  //         why_this_why_now: null,
  //         description: null,
  //         state: "published",
  //       },
  //     ],
  //   };
  //   const { findAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataPrimaryEnglish}
  //       formattedData={formatCurriculumUnitsData(data)} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: [],
  //         threads: []
  //       }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //         throw new Error("Function not implemented.");
  //       } }      />,
  //   );
  //   const threadOptions = await findAllByTestId("thread-radio");
  //   expect(threadOptions).toHaveLength(3);
  //   expect(threadOptions.map((option) => option.getAttribute("value"))).toEqual(
  //     [
  //       "aspects-of-narrative",
  //       "aspiration",
  //       "developing-grammatical-knowledge",
  //     ],
  //   );
  // });

  // test("user can see all the thread choices", async () => {
  //   const { findByTestId, findAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(curriculumUnitsTabFixture())} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: [],
  //         threads: []
  //       }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //         throw new Error("Function not implemented.");
  //       } }      />,
  //   );
  //   expect(await findByTestId("no-threads-radio")).toBeInTheDocument();
  //   const threads = await findAllByTestId("thread-radio");
  //   const threadSet = new Set();
  //   curriculumUnitsTabFixture().units.forEach((unit) => {
  //     unit.threads.forEach((thread) => {
  //       threadSet.add(thread.slug);
  //     });
  //   });
  //   expect(threads).toHaveLength(threadSet.size);
  // });

  // test("All the year group choices are visible", async () => {
  //   const { findByTestId, findAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(curriculumUnitsTabFixture())} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: [],
  //         threads: []
  //       }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //         throw new Error("Function not implemented.");
  //       } }      />,
  //   );
  //   expect(await findByTestId("all-years-radio")).toBeInTheDocument();
  //   const yearOptions = await findAllByTestId("year-radio");
  //   const yearSet = new Set(
  //     curriculumUnitsTabFixture().units.map((unit) => unit.year),
  //   );
  //   expect(yearOptions).toHaveLength(yearSet.size);
  // });

  // test("Year group choices are properly sorted", async () => {
  //   const { findAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(curriculumUnitsTabFixture())} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: [],
  //         threads: []
  //       }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //         throw new Error("Function not implemented.");
  //       } }      />,
  //   );
  //   const yearOptions = await findAllByTestId("year-radio");
  //   const extractedYears = yearOptions.map((option) =>
  //     parseInt(option.getAttribute("value") || "0"),
  //   );
  //   const isSorted = extractedYears.every((year, index, array) => {
  //     return index === 0 || Number(array[index - 1]) <= year;
  //   });
  //   expect(isSorted).toBe(true);
  // });

  // test("duplicate units without examboard are filtered out", async () => {
  //   const data = {
  //     units: [
  //       {
  //         planned_number_of_lessons: 8,
  //         domain: null,
  //         domain_id: null,
  //         connection_future_unit_description: null,
  //         connection_prior_unit_description: null,
  //         connection_future_unit_title: null,
  //         connection_prior_unit_title: null,
  //         examboard: "AQA",
  //         examboard_slug: "aqa",
  //         keystage_slug: "ks4",
  //         lessons: [],
  //         order: 1,
  //         phase: "Secondary",
  //         phase_slug: "secondary",
  //         slug: "modern-text-first-study",
  //         subject: "English",
  //         subject_parent: null,
  //         subject_parent_slug: null,
  //         subject_slug: "english",
  //         tags: null,
  //         subjectcategories: null,
  //         threads: [],
  //         tier: null,
  //         tier_slug: null,
  //         title: "Modern text: first study",
  //         unit_options: [
  //           {
  //             connection_future_unit_description: null,
  //             connection_prior_unit_description: null,
  //             connection_future_unit_title: null,
  //             connection_prior_unit_title: null,
  //             lessons: [],
  //             title: "Animal Farm: the pigs and power",
  //             unitvariant_id: 774,
  //             why_this_why_now: null,
  //             description: null,
  //             state: "published",
  //           },
  //           {
  //             connection_future_unit_description: null,
  //             connection_prior_unit_description: null,
  //             connection_future_unit_title: null,
  //             connection_prior_unit_title: null,
  //             lessons: [],
  //             title: "Leave Taking: a sense of belonging",
  //             unitvariant_id: 773,
  //             why_this_why_now: null,
  //             description: null,
  //             state: "published",
  //           },
  //         ],
  //         year: "10",
  //         cycle: "1",
  //         why_this_why_now: null,
  //         description: null,
  //         state: "published",
  //       },
  //       {
  //         planned_number_of_lessons: 8,
  //         domain: null,
  //         domain_id: null,
  //         connection_future_unit_description: null,
  //         connection_prior_unit_description: null,
  //         connection_future_unit_title: null,
  //         connection_prior_unit_title: null,
  //         examboard: null,
  //         examboard_slug: null,
  //         keystage_slug: "ks4",
  //         lessons: [],
  //         order: 1,
  //         phase: "Secondary",
  //         phase_slug: "secondary",
  //         slug: "modern-text-first-study",
  //         subject: "English",
  //         subject_parent: null,
  //         subject_parent_slug: null,
  //         subject_slug: "english",
  //         tags: null,
  //         subjectcategories: null,
  //         threads: [],
  //         tier: null,
  //         tier_slug: null,
  //         title: "Modern text: first study",
  //         unit_options: [
  //           {
  //             connection_future_unit_description: null,
  //             connection_prior_unit_description: null,
  //             connection_future_unit_title: null,
  //             connection_prior_unit_title: null,
  //             lessons: [],
  //             title: "Animal Farm: the pigs and power",
  //             unitvariant_id: 774,
  //             why_this_why_now: null,
  //             description: null,
  //             state: "published",
  //           },
  //         ],
  //         year: "10",
  //         cycle: "1",
  //         why_this_why_now: null,
  //         description: null,
  //         state: "published",
  //       },
  //     ],
  //   };
  //   const formattedData = formatCurriculumUnitsData(data);
  //   const trackingData = {
  //     subjectTitle: "English",
  //     subjectSlug: "english",
  //     ks4OptionSlug: "aqa",
  //     phaseSlug: "secondary",
  //   };
  //   const { findByTestId, findAllByTestId } = render(
  //     <UnitsTab trackingData={trackingData} formattedData={formattedData} filters={{
  //       childSubjects: [],
  //       subjectCategories: [],
  //       tiers: [],
  //       years: [],
  //       threads: []
  //     }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //       throw new Error("Function not implemented.");
  //     } } />,
  //   );
  //   const unitCards = await findAllByTestId("unit-card");
  //   expect(unitCards).toHaveLength(1);
  //   const tag = await findByTestId("options-tag");
  //   expect(tag).toHaveTextContent("2");
  // });

  // test("user can highlight units by threads", async () => {
  //   const { queryByTestId, queryAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataPrimaryEnglish}
  //       formattedData={formatCurriculumUnitsData(primaryEnglishData)} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: [],
  //         threads: []
  //       }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //         throw new Error("Function not implemented.");
  //       } }      />,
  //   );
  //   const threads = queryAllByTestId("thread-radio");
  //   if (!threads[0]) {
  //     throw new Error("No thread option found");
  //   }
  //   await userEvent.click(threads[0]);

  //   const threadUnits = primaryEnglishData.units.filter((unit) =>
  //     unit.threads.some(
  //       (thread) => thread.slug === threads[0]?.getAttribute("value"),
  //     ),
  //   );
  //   const highlightedUnits = queryAllByTestId("highlighted-unit-card");
  //   expect(threadUnits).toHaveLength(highlightedUnits.length);
  //   const selectedThread = queryByTestId("selected-thread-radio");
  //   expect(selectedThread).toBeInTheDocument();
  // });

  // test("user can filter by year group", async () => {
  //   const { queryAllByTestId, findAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(curriculumUnitsTabFixture())} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: [],
  //         threads: []
  //       }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //         throw new Error("Function not implemented.");
  //       } }      />,
  //   );
  //   const yearOptions = queryAllByTestId("year-radio");
  //   if (!yearOptions[0]) {
  //     throw new Error("No year option found");
  //   }
  //   await userEvent.click(yearOptions[0]);
  //   const headings = await findAllByTestId("year-heading");
  //   expect(headings).toHaveLength(1);
  //   expect(headings[0]).toHaveTextContent(
  //     String(yearOptions[0]?.getAttribute("value")),
  //   );
  // });

  // test("user can filter units by parent subject", async () => {
  //   const { findAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(secondaryScienceUnits)} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: [],
  //         threads: []
  //       }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //         throw new Error("Function not implemented.");
  //       } }      />,
  //   );
  //   let unitCards = await findAllByTestId("unit-card");
  //   // Combined science is selected by default, so only 1 expected
  //   expect(unitCards).toHaveLength(1);
  //   const subjectButtons = await findAllByTestId("subject-button");
  //   expect(subjectButtons).toHaveLength(2);
  //   if (!subjectButtons[1]) {
  //     throw new Error("Missing second subject button");
  //   }
  //   userEvent.click(subjectButtons[1]);
  //   await waitFor(async () => {
  //     unitCards = await findAllByTestId("unit-card");
  //     expect(unitCards).toHaveLength(1);
  //     expect(unitCards[0]).toHaveTextContent("Nuclear Physics");
  //   });
  // });

  // test.only("user can filter units by discipline", async () => {
  //   const data = curriculumUnitsTabFixture();
  //   const { findAllByTestId, queryAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(curriculumUnitsTabFixture())} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: [],
  //         threads: []
  //       }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //         throw new Error("Function not implemented.");
  //       } }      />,
  //   );

  //   const yearOptions = (await queryAllByTestId(
  //     "year-radio",
  //   )) as HTMLInputElement[];

  //   const year7Option = yearOptions.find((option) => option.value === "7");
  //   if (!year7Option) {
  //     throw new Error("No year 7 option found");
  //   }

  //   // Check we only have 14 units for year 7 to start with (combined science).
  //   await userEvent.click(year7Option);
  //   let unitCards;
  //   await waitFor(async () => {
  //     unitCards = await findAllByTestId("unit-card");
  //     expect(unitCards).toHaveLength(14);
  //   });

  //   const subjectCategoryButtons = await findAllByTestId(
  //     "subjectCategory-button",
  //   );

  //   if (
  //     !subjectCategoryButtons[0] ||
  //     !subjectCategoryButtons[1] ||
  //     !subjectCategoryButtons[2]
  //   ) {
  //     throw new Error("Missing second subject button");
  //   }

  //   expect(subjectCategoryButtons[0]).toHaveTextContent("All");
  //   expect(subjectCategoryButtons[1]).toHaveTextContent("Biology");
  //   expect(subjectCategoryButtons[2]).toHaveTextContent("Chemistry");

  //   // Check we have 6 units after clicking the Biology button.
  //   await userEvent.click(subjectCategoryButtons[1]);
  //   await waitFor(async () => {
  //     unitCards = await findAllByTestId("unit-card");
  //     expect(unitCards).toHaveLength(6);
  //     const cellsUnit = data.units.filter((unit) => {
  //       const yearFilter = unit.year === "7";
  //       const disciplineFilter =
  //         unit.tags && unit.tags[0] && unit.tags[0]?.title === "Biology";

  //       return yearFilter && disciplineFilter;
  //     });

  //     if (!cellsUnit[0]) {
  //       throw new Error("No unit title in fixture");
  //     }
  //     expect(unitCards[0]).toHaveTextContent(cellsUnit[0].title);
  //   });

  //   // Check we have 4 units after clicking the Chemistry button.
  //   await userEvent.click(subjectCategoryButtons[2]);
  //   await waitFor(async () => {
  //     unitCards = await findAllByTestId("unit-card");
  //     expect(unitCards).toHaveLength(4);
  //   });

  //   // Check we have 2 units after clicking the All button.
  //   await userEvent.click(subjectCategoryButtons[0]);
  //   await waitFor(async () => {
  //     unitCards = await findAllByTestId("unit-card");
  //     expect(unitCards).toHaveLength(14);
  //   });
  // });

  // test("user can filter units by tier", async () => {
  //   const data = {
  //     units: [
  //       {
  //         planned_number_of_lessons: 5,
  //         connection_future_unit_description: null,
  //         connection_prior_unit_description: null,
  //         connection_future_unit_title: null,
  //         connection_prior_unit_title: null,
  //         domain: null,
  //         domain_id: null,
  //         examboard: null,
  //         examboard_slug: null,
  //         keystage_slug: "ks4",
  //         lessons: [],
  //         order: 1,
  //         phase: "Secondary",
  //         phase_slug: "secondary",
  //         slug: "cellular-respiration-and-atp",
  //         subject: "Combined Science",
  //         subject_parent: "Science",
  //         subject_parent_slug: "science",
  //         subject_slug: "combined-science",
  //         tags: null,
  //         subjectcategories: null,
  //         threads: [],
  //         childSubjects: [],
  //         tier: "Foundation",
  //         tier_slug: "foundation",
  //         title: "Aerobic and anaerobic cellular respiration",
  //         unit_options: [],
  //         year: "11",
  //         cycle: "1",
  //         why_this_why_now: null,
  //         description: null,
  //         state: "published",
  //       },
  //       {
  //         connection_future_unit_description: null,
  //         connection_prior_unit_description: null,
  //         connection_future_unit_title: null,
  //         connection_prior_unit_title: null,
  //         domain: null,
  //         domain_id: null,
  //         tags: null,
  //         subjectcategories: null,
  //         threads: [],
  //         childSubjects: [],
  //         examboard: null,
  //         examboard_slug: null,
  //         keystage_slug: "ks4",
  //         lessons: [
  //           {
  //             title: "Lesson 1",
  //             slug: "lesson-1",
  //             order: 1,
  //             _state: "published",
  //           },
  //           {
  //             title: "Lesson 2",
  //             slug: "lesson-2",
  //             order: 2,
  //             _state: "published",
  //           },
  //           {
  //             title: "Lesson 3",
  //             slug: "lesson-3",
  //             order: 3,
  //             _state: "published",
  //           },
  //           {
  //             title: "Lesson 4",
  //             slug: "lesson-4",
  //             order: 4,
  //             _state: "published",
  //           },
  //           {
  //             title: "Lesson 5",
  //             slug: "lesson-5",
  //             order: 5,
  //             _state: "published",
  //           },
  //         ],
  //         order: 2,
  //         phase: "Secondary",
  //         phase_slug: "secondary",
  //         planned_number_of_lessons: 5,
  //         slug: "nuclear-physics",
  //         subject: "Combined Science",
  //         subject_parent: "Science",
  //         subject_parent_slug: "science",
  //         subject_slug: "combined-science",
  //         tier: "Higher",
  //         tier_slug: "higher",
  //         title: "Nuclear Physics",
  //         unit_options: [],
  //         year: "11",
  //         cycle: "1",
  //         why_this_why_now: null,
  //         description: null,
  //         state: "published",
  //       },
  //       {
  //         connection_future_unit_description: null,
  //         connection_prior_unit_description: null,
  //         connection_future_unit_title: null,
  //         connection_prior_unit_title: null,
  //         domain: null,
  //         domain_id: null,
  //         tags: null,
  //         subjectcategories: null,
  //         threads: [],
  //         childSubjects: [],
  //         examboard: null,
  //         examboard_slug: null,
  //         keystage_slug: "ks4",
  //         lessons: [],
  //         order: 3,
  //         phase: "Secondary",
  //         phase_slug: "secondary",
  //         planned_number_of_lessons: 5,
  //         slug: "industrial-chemistry",
  //         subject: "Combined Science",
  //         subject_parent: "Science",
  //         subject_parent_slug: "science",
  //         subject_slug: "combined-science",
  //         tier: null,
  //         tier_slug: null,
  //         title: "Industrial Chemistry",
  //         unit_options: [],
  //         year: "11",
  //         cycle: "1",
  //         why_this_why_now: null,
  //         description: null,
  //         state: "published",
  //       },
  //     ],
  //   };
  //   const { findAllByTestId, findByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(data)} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: ["foundation"],
  //         years: ["11"],
  //         threads: []
  //       }} onChangeFilters={function (newFilter: CurriculumFilters): void {
  //         throw new Error("Function not implemented.");
  //       } }      />,
  //   );
  //   let unitCards = await findAllByTestId("unit-card");
  //   // Foundation selected by default, so only 2 (including blank) expected
  //   expect(unitCards).toHaveLength(2);
  //   const tierFieldset = await findByTestId("tiers");
  //   const tierRadios = tierFieldset.querySelectorAll(`input[type="radio"]`)
  //   expect(tierRadios).toHaveLength(2);
  // });

  // test("user can see correct number of unit options", async () => {
  //   const { findByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataPrimaryEnglish}
  //       formattedData={formatCurriculumUnitsData(primaryEnglishData)} filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: ["6"],
  //         threads: []
  //       }} onChangeFilters={() => {}}      />,
  //   );

  //   const tag = await findByTestId("options-tag");
  //   expect(tag).toHaveTextContent("2");
  // });

  // const resizeWindow = (x: number, y: number) => {
  //   window.innerWidth = x;
  //   window.innerHeight = y;
  //   window.dispatchEvent(new Event("resize"));
  // };

  // test("mobile: highlighting threads updates the number of threads highlighted", async () => {
  //   resizeWindow(390, 844);

  //   const { findByTestId, findAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(curriculumUnitsTabFixture())}
  //     />,
  //   );
  //   // Open thread modal
  //   const filterThreadsButton = await findByTestId("mobile-highlight-thread");
  //   await userEvent.click(filterThreadsButton);

  //   const threadRadios = await findAllByTestId("thread-radio-mobile");
  //   const doneButton = await findByTestId("mobile-done-thread-modal-button");
  //   const livingThingsThread = threadRadios[0];
  //   if (livingThingsThread && doneButton) {
  //     // Select the first thread
  //     await userEvent.click(livingThingsThread);
  //     await userEvent.click(doneButton);

  //     const highlightedThreadsBox = await findByTestId(
  //       "highlighted-threads-mobile",
  //     );
  //     const highlightedUnitsBox = await findByTestId(
  //       "highlighted-units-box-mobile",
  //     );
  //     expect(highlightedThreadsBox).toBeInTheDocument();
  //     expect(highlightedThreadsBox).toHaveTextContent(
  //       "BQ01 Biology: What are living things and what are they made of?",
  //     );
  //     // Not sure if this number hasn't been properly checked. It's a bit like a snapshot, I'm going to leave it as is so that if it changes unexpectedly it is picked up.
  //     expect(highlightedUnitsBox).toHaveTextContent("16 units highlighted");
  //   }
  // });
  // test("mobile: mobile filter options visible", async () => {
  //   resizeWindow(390, 844);

  //   const { findByTestId, findAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(curriculumUnitsTabFixture())}
  //     />,
  //   );
  //   const mobileThreadButton = await findByTestId("mobile-highlight-thread");
  //   const mobileYearFilter = await findByTestId("year-selection-mobile");
  //   const mobileYearFilterButtons = await findAllByTestId(
  //     "year-group-filter-button",
  //   );
  //   expect(mobileThreadButton).toBeInTheDocument();
  //   expect(mobileYearFilter).toBeInTheDocument();
  //   expect(mobileYearFilterButtons).toHaveLength(5);
  // });
  // test("desktop filters are not visible in mobile", async () => {
  //   resizeWindow(390, 844);

  //   const { findByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(curriculumUnitsTabFixture())}
  //     />,
  //   );

  //   const yearsRadio = await findByTestId("year-group-filter-desktop");
  //   expect(yearsRadio).toHaveStyle({ display: "none" });

  //   const threadsFilter = await findByTestId("threads-filter-desktop");
  //   expect(threadsFilter).toHaveStyle({ display: "none" });
  // });

  // test("mobile: anchor links for year group filters match", async () => {
  //   window.HTMLElement.prototype.scrollIntoView = function () {};
  //   resizeWindow(390, 844);

  //   const { findAllByTestId } = render(
  //     <UnitsTab
  //       trackingData={trackingDataSecondaryScience}
  //       formattedData={formatCurriculumUnitsData(curriculumUnitsTabFixture())}
  //       filters={{
  //         childSubjects: [],
  //         subjectCategories: [],
  //         tiers: [],
  //         years: [],
  //         threads: []
  //       }}
  //       onChangeFilters={() => {}}
  //     />,
  //   );

  //   const yearFilterButtons = await findAllByTestId("year-group-filter-button");
  //   const yearHeadings = await findAllByTestId("year-heading");
  //   const year2Button = yearFilterButtons[1];
  //   if (year2Button) {
  //     await userEvent.click(year2Button);
  //     // Selected button background colour should change
  //     waitFor(() => {
  //       expect(year2Button).toHaveStyle("background-color: rgb(34, 34, 34);");
  //       // Unselected button background colour shouldn't change
  //       expect(yearFilterButtons[0]).toHaveStyle(
  //         "background-color: rgb(242, 242, 242);",
  //       );
  //       expect(year2Button).toHaveTextContent("Year 2");
  //       expect(yearHeadings[1]).toHaveTextContent("Year 2");
  //     });
  //   }
  // });
});
