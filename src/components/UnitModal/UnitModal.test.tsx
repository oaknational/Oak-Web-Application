import UnitModal from "./UnitModal";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { Unit } from "@/components/pages/CurriculumInfo/tabs/UnitsTab/UnitsTab";

/**
 * ! - Refactor!!!!
 */

const optionalUnits = [
  {
    title: "Test optional unit 1",
    unitvariant_id: 1,
  },
  {
    title: "Test optional unit 2",
    unitvariant_id: 2,
  },
  {
    title: "Test optional unit 3",
    unitvariant_id: 3,
  },
];

export const mockUnit: Unit = {
  connection_future_unit_description: "Test connection future unit description",
  connection_prior_unit_description: "Test connection prior unit description",
  domain: null,
  domain_id: null,
  examboard: null,
  examboard_slug: null,
  keystage_slug: "ks1",
  phase: "Primary",
  phase_slug: "primary",
  planned_number_of_lessons: 15,
  slug: "composition-of-numbers-6-to-10",
  subject: "Maths",
  subject_parent: null,
  subject_parent_slug: null,
  subject_slug: "maths",
  threads: [
    {
      slug: "number-addition-and-subtraction",
      title: "Number: Addition and Subtraction",
      order: 2,
    },
    {
      slug: "number",
      title: "Number",
      order: 1,
    },
  ],
  tier: null,
  tier_slug: null,
  title: "Composition of numbers 6 to 10",
  unit_options: [],
  year: "1",
};

export const mockOptionalityUnit: Unit = {
  connection_future_unit_description: "Test connection future unit description",
  connection_prior_unit_description: "Test connection prior unit description",
  domain: null,
  domain_id: null,
  examboard: null,
  examboard_slug: null,
  keystage_slug: "ks1",
  phase: "Primary",
  phase_slug: "primary",
  planned_number_of_lessons: 15,
  slug: "composition-of-numbers-6-to-10",
  subject: "Maths",
  subject_parent: null,
  subject_parent_slug: null,
  subject_slug: "maths",
  threads: [
    {
      slug: "number-addition-and-subtraction",
      title: "Number: Addition and Subtraction",
      order: 2,
    },
    {
      slug: "number",
      title: "Number",
      order: 1,
    },
  ],
  tier: null,
  tier_slug: null,
  title: "Composition of numbers 6 to 10",
  unit_options: optionalUnits,
  year: "1",
};

describe("Unit modal", () => {
  test("renders with correct heading", () => {
    const { getByText } = renderWithTheme(<UnitModal unitData={mockUnit} />);
    expect(getByText("Composition of numbers 6 to 10")).toBeInTheDocument();
  });

  test("renders the correct number of threads", () => {
    const { getAllByTestId, getByText } = renderWithTheme(
      <UnitModal unitData={mockUnit} />,
    );
    const testThread = getByText("Number: Addition and Subtraction");
    const testThread2 = getByText("Number");

    expect(getAllByTestId("thread-tag")).toHaveLength(2);
    expect(testThread).toBeInTheDocument();
    expect(testThread2).toBeInTheDocument();
  });

  test.skip("lesson metadata is correct", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <UnitModal unitData={mockUnit} />,
    );

    const x = getByTestId("lesson-metadata");
    console.log(x);
    expect(getByText("Maths")).toBeInTheDocument();
    expect(getByText("Year 1")).toBeInTheDocument();
  });

  describe("non-optional units", () => {
    test("does not render optionality card", () => {
      const { queryAllByTestId } = renderWithTheme(
        <UnitModal unitData={mockUnit} />,
      );

      expect(queryAllByTestId("unit-option-card")).toHaveLength(0);
    });
  });

  describe("optional units", () => {
    test("optionality cards render", () => {
      const { getByTestId } = renderWithTheme(
        <UnitModal unitData={mockOptionalityUnit} />,
      );

      const optionalityCard = getByTestId("unit-options-card");
      expect(optionalityCard).toBeInTheDocument();
    });

    test("optionality cards render correct number of units", () => {
      const { getAllByTestId } = renderWithTheme(
        <UnitModal unitData={mockOptionalityUnit} />,
      );

      expect(getAllByTestId("unit-option")).toHaveLength(3);
    });
  });
});
