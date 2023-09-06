import userEvent from "@testing-library/user-event";

import UnitsTab from "./UnitsTab";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import curriculumUnitsTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumUnits.fixture";

describe("components/pages/CurriculumInfo/tabs/UnitsTab", () => {
  test("user can see the content", async () => {
    const { queryAllByTestId } = renderWithTheme(
      <UnitsTab data={curriculumUnitsTabFixture()} />
    );
    expect(queryAllByTestId("units-heading")[0]).toBeInTheDocument();
    expect(queryAllByTestId("unit-card")[0]).toBeInTheDocument();
  });

  test("number of unit cards matches units", async () => {
    const { findAllByTestId } = renderWithTheme(
      <UnitsTab data={curriculumUnitsTabFixture()} />
    );
    const unitCards = await findAllByTestId("unit-card");
    expect(unitCards).toHaveLength(curriculumUnitsTabFixture().units.length);
  });

  test("builds links to unit lesson index", async () => {
    const { findAllByTestId } = renderWithTheme(
      <UnitsTab data={curriculumUnitsTabFixture()} />
    );
    const unitLinks = await findAllByTestId("unit-link");
    if (unitLinks.length === 0 || !unitLinks[0]) {
      throw new Error("No unit links found");
    }
    const unit = curriculumUnitsTabFixture().units[0];
    if (unit === undefined) {
      throw new Error("Fixture unit missing");
    }
    expect(unitLinks[0].getAttribute("href")).toContain(unit.slug);
  });

  test("user can filter units by parent subject", async () => {
    const data = {
      units: [
        {
          planned_number_of_lessons: 5,
          domains: [],
          threads: [],
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks4",
          phase: "Secondary",
          phase_slug: "secondary",
          slug: "cellular-respiration-and-atp",
          subject: "Combined Science",
          subject_parent: "Science",
          subject_parent_slug: "science",
          subject_slug: "combined-science",
          tier: null,
          tier_slug: null,
          title: "Aerobic and anaerobic cellular respiration",
          year: "11",
        },
        {
          planned_number_of_lessons: 5,
          domains: [],
          threads: [],
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks4",
          phase: "Secondary",
          phase_slug: "secondary",
          slug: "nuclear-physics",
          subject: "Physics",
          subject_parent: "Science",
          subject_parent_slug: "science",
          subject_slug: "physics",
          tier: null,
          tier_slug: null,
          title: "Nuclear Physics",
          year: "11",
        },
      ],
    };
    const { findAllByTestId } = renderWithTheme(<UnitsTab data={data} />);
    let unitCards = await findAllByTestId("unit-card");
    // Combined science is selected by default, so only 1 expected
    expect(unitCards).toHaveLength(1);
    const subjectButtons = await findAllByTestId("subject-button");
    expect(subjectButtons).toHaveLength(2);
    if (!subjectButtons[1]) {
      throw new Error("Missing second subject button");
    }
    await userEvent.click(subjectButtons[1]);
    unitCards = await findAllByTestId("unit-card");
    expect(unitCards).toHaveLength(1);
    expect(unitCards[0]).toHaveTextContent("Nuclear Physics");
  });

  test("user can filter units by domain", async () => {
    const data = {
      units: [
        {
          planned_number_of_lessons: 8,
          domains: [
            {
              title: "Grammar",
              tag_id: 17,
            },
          ],
          threads: [],
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks1",
          phase: "Primary",
          phase_slug: "primary",
          slug: "word-class",
          subject: "English",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "english",
          tier: null,
          tier_slug: null,
          title: "Word Class",
          year: "1",
        },
        {
          planned_number_of_lessons: 8,
          domains: [
            {
              title: "Reading, Writing & Oracy",
              tag_id: 16,
            },
          ],
          threads: [],
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks1",
          phase: "Primary",
          phase_slug: "primary",
          slug: "a-superhero-like-you-reading-and-writing",
          subject: "English",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "english",
          tier: null,
          tier_slug: null,
          title: "’A Superhero Like You!’: Reading and Writing",
          year: "1",
        },
      ],
    };
    const { findAllByTestId } = renderWithTheme(<UnitsTab data={data} />);
    let unitCards = await findAllByTestId("unit-card");
    expect(unitCards).toHaveLength(2);
    const domainButtons = await findAllByTestId("domain-button");
    // When there are tiers, "All" button is added, so 3 expected
    expect(domainButtons).toHaveLength(3);
    if (!domainButtons[1]) {
      throw new Error("Missing second domain button");
    }
    await userEvent.click(domainButtons[1]);
    unitCards = await findAllByTestId("unit-card");
    expect(unitCards).toHaveLength(1);
    expect(unitCards[0]).toHaveTextContent("A Superhero Like You!");
  });

  test("user can filter units by tier", async () => {
    const data = {
      units: [
        {
          planned_number_of_lessons: 5,
          domains: [],
          threads: [],
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks4",
          phase: "Secondary",
          phase_slug: "secondary",
          slug: "cellular-respiration-and-atp",
          subject: "Biology",
          subject_parent: "Science",
          subject_parent_slug: "science",
          subject_slug: "biology",
          tier: "Foundation",
          tier_slug: "foundation",
          title: "Aerobic and anaerobic cellular respiration",
          year: "11",
        },
        {
          planned_number_of_lessons: 5,
          domains: [],
          threads: [],
          connection_future_unit_description: null,
          connection_prior_unit_description: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks4",
          phase: "Secondary",
          phase_slug: "secondary",
          slug: "nuclear-physics",
          subject: "Physics",
          subject_parent: "Science",
          subject_parent_slug: "science",
          subject_slug: "physics",
          tier: "Higher",
          tier_slug: "higher",
          title: "Nuclear Physics",
          year: "11",
        },
      ],
    };
    const { findAllByTestId } = renderWithTheme(<UnitsTab data={data} />);
    let unitCards = await findAllByTestId("unit-card");
    // Foundation selected by default, so only 1 expected
    expect(unitCards).toHaveLength(1);
    const tierButtons = await findAllByTestId("tier-button");
    expect(tierButtons).toHaveLength(2);
    if (!tierButtons[1]) {
      throw new Error("Missing second subject button");
    }
    await userEvent.click(tierButtons[1]);
    unitCards = await findAllByTestId("unit-card");
    expect(unitCards).toHaveLength(1);
    expect(unitCards[0]).toHaveTextContent("Nuclear Physics");
  });
});
