import { within, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { usePathname } from "next/navigation";

import ProgrammeSequence from "./Sequence";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { YearData } from "@/utils/curriculum/types";
import {
  noMissingUnitsFixture,
  missingUnitsForFirstYearFixture,
  missingUnitsForSecondYearFixture,
  missingConsecutiveUnitsAtStartFixture,
  missingUnitsInMiddleFixture,
  missingConsecutiveUnitsAtEndFixture,
  missingAlternateUnitsFixture,
  missingUnitForLastYearFixture,
  missingUnitsForFirstYearPrimaryFixture,
  missingConsecutiveUnitsAtStartPrimaryFixture,
  secondaryScienceYearData,
  secondaryMathsYearData,
  primaryEnglishYearData,
  primaryScienceYearData,
} from "@/components/CurriculumComponents/CurricVisualiser/CurricVisualiser.fixtures";

const render = renderWithProviders();
jest.mock("next/navigation");

(usePathname as jest.Mock).mockReturnValue("/");

// Mock HTMLDialogElement methods that jsdom doesn't support
HTMLDialogElement.prototype.showModal = jest.fn();
HTMLDialogElement.prototype.close = jest.fn();

const CurricVisualiserFixture: ComponentProps<typeof ProgrammeSequence> = {
  threadOptions: [],
  filters: {
    years: ["7", "8", "9", "10", "11"],
    tiers: [],
    childSubjects: [],
    pathways: [],
    subjectCategories: [],
    threads: [],
    keystages: [],
  },
  ks4Options: [],
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
          national_curriculum_content: [],
          prior_knowledge_requirements: [],
        },
      ],
      childSubjects: [],
      pathways: [],
      tiers: [],
      subjectCategories: [],
      isSwimming: false,
      groupAs: null,
      nationalCurriculum: [],
      keystage: "ks3",
    },
  },
};

describe("ProgrammeSequence", () => {
  const resizeWindow = (x: number, y: number) => {
    globalThis.innerWidth = x;
    globalThis.innerHeight = y;
    globalThis.dispatchEvent(new Event("resize"));
  };

  test("visualiser is visible on mobile", () => {
    resizeWindow(390, 844);

    render(<ProgrammeSequence {...CurricVisualiserFixture} />);
    const yearSection = screen.getByRole("heading", { name: "Year 7 units" });
    expect(yearSection).toBeInTheDocument();
  });

  test("visualiser is visible on desktop", () => {
    render(<ProgrammeSequence {...CurricVisualiserFixture} />);
    const yearSection = screen.getByRole("heading", { name: "Year 7 units" });
    expect(yearSection).toBeInTheDocument();
  });

  test("correct number of units displayed", () => {
    resizeWindow(390, 844);
    render(<ProgrammeSequence {...CurricVisualiserFixture} />);

    const unitCards = screen.getAllByTestId("card-listing-container");

    expect(unitCards).toHaveLength(1);
  });

  test("displays swimming subheading and icon when isSwimming is true", () => {
    const swimmingYearData: YearData = {
      "7": {
        ...CurricVisualiserFixture.yearData["7"]!,
        isSwimming: true,
      },
    };

    const filterFixture = {
      childSubjects: [],
      pathways: ["core"],
      subjectCategories: [],
      tiers: [],
      years: ["7"],
      threads: [],
    };

    const { container } = render(
      <ProgrammeSequence
        {...CurricVisualiserFixture}
        yearData={swimmingYearData}
        filters={filterFixture}
      />,
    );

    const yearBlock = container.querySelector(
      '[data-testid="year-all-7"]',
    ) as HTMLElement;
    expect(yearBlock).not.toBeNull();

    const subheading = within(yearBlock).getByTestId("year-subheading");
    expect(subheading).toHaveTextContent(
      "Swimming and water safety units should be selected based on the ability and experience of your pupils.",
    );
  });
});

describe("Programme units sequence filter states", () => {
  describe("Secondary phase", () => {
    test("Units exist for subject category in each year of phase", async () => {
      const noMissingUnitsFixtureWithProps = {
        ...CurricVisualiserFixture,
        yearData: noMissingUnitsFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["sub-cat-1"],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
        keystages: [],
      };

      render(
        <ProgrammeSequence
          {...noMissingUnitsFixtureWithProps}
          filters={filterFixture}
        />,
      );

      const unitCards = screen.getAllByTestId("card-listing-container");
      expect(unitCards).toHaveLength(5);
    });

    test("No units for subject category in first year of phase", async () => {
      const missingUnitsForFirstYearFixtureWithProps = {
        ...CurricVisualiserFixture,
        yearData: missingUnitsForFirstYearFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["sub-cat-1"],
        tiers: [],
        years: ["7"],
        threads: [],
        keystages: [],
      };

      render(
        <ProgrammeSequence
          {...missingUnitsForFirstYearFixtureWithProps}
          filters={filterFixture}
        />,
      );
      expect(
        await screen.findAllByText(/'sub-cat-1' units start in Year 8/i),
      ).toHaveLength(1);
    });

    test("No units for subject category in second year of phase", async () => {
      const missingUnitsForSecondYearFixtureWithProps = {
        ...CurricVisualiserFixture,
        yearData: missingUnitsForSecondYearFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["sub-cat-1"],
        tiers: [],
        years: ["8"],
        threads: [],
        keystages: [],
      };

      render(
        <ProgrammeSequence
          {...missingUnitsForSecondYearFixtureWithProps}
          filters={filterFixture}
        />,
      );
      expect(
        await screen.findAllByText(/'sub-cat-1' units continue in Year 9/i),
      ).toHaveLength(1);
    });

    test("No units for consecutive years at the start of the phase", async () => {
      const missingConsecutiveUnitsAtStartFixtureWithProps = {
        ...CurricVisualiserFixture,
        yearData: missingConsecutiveUnitsAtStartFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["sub-cat-1"],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
        keystages: [],
      };

      render(
        <ProgrammeSequence
          {...missingConsecutiveUnitsAtStartFixtureWithProps}
          filters={filterFixture}
        />,
      );

      expect(
        await screen.findAllByText(/'sub-cat-1' units start in Year 10/i),
      ).toHaveLength(1);
      expect(
        await screen.findAllByText(/'sub-cat-1' units continue in Year 10/i),
      ).toHaveLength(2);

      const unitCards = await screen.findAllByTestId("card-listing-container");
      expect(unitCards).toHaveLength(2);
    });

    test("No units in the middle of the phase", async () => {
      const missingUnitsInMiddleFixtureWithProps = {
        ...CurricVisualiserFixture,
        yearData: missingUnitsInMiddleFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["sub-cat-1"],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
        keystages: [],
      };

      render(
        <ProgrammeSequence
          {...missingUnitsInMiddleFixtureWithProps}
          filters={filterFixture}
        />,
      );

      expect(
        await screen.findAllByText(/'sub-cat-1' units continue in Year 11/i),
      ).toHaveLength(3);
      const unitCards = await screen.findAllByTestId("card-listing-container");
      expect(unitCards).toHaveLength(2);
    });

    test("No consecutive subsequent units at the end of the phase", async () => {
      const missingConsecutiveUnitsAtEndFixtureWithProps = {
        ...CurricVisualiserFixture,
        yearData: missingConsecutiveUnitsAtEndFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["sub-cat-1"],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
        keystages: [],
      };

      render(
        <ProgrammeSequence
          {...missingConsecutiveUnitsAtEndFixtureWithProps}
          filters={filterFixture}
        />,
      );
      const unitCards = await screen.findAllByTestId("card-listing-container");
      expect(unitCards).toHaveLength(2);
      const messages = await screen.findAllByText(
        /No 'sub-cat-1' units in this year group/i,
      );
      expect(messages).toHaveLength(3);
    });

    test("No alternate units in the phase", async () => {
      const missingAlternateUnitsFixtureWithProps = {
        ...CurricVisualiserFixture,
        yearData: missingAlternateUnitsFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["sub-cat-1"],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
        keystages: [],
      };

      render(
        <ProgrammeSequence
          {...missingAlternateUnitsFixtureWithProps}
          filters={filterFixture}
        />,
      );

      const unitCards = await screen.findAllByTestId("card-listing-container");
      expect(unitCards).toHaveLength(2);
      expect(
        await screen.findByText(/'sub-cat-1' units start in Year 8/i),
      ).toBeInTheDocument();
      expect(
        await screen.findByText(/'sub-cat-1' units continue in Year 10/i),
      ).toBeInTheDocument();
      expect(
        await screen.findByText(/No 'sub-cat-1' units in this year group/i),
      ).toBeInTheDocument();
    });

    test("No unit at the end of the phase", async () => {
      const missingUnitForLastYearFixtureWithProps = {
        ...CurricVisualiserFixture,
        yearData: missingUnitForLastYearFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["sub-cat-1"],
        tiers: [],
        years: ["7", "8", "9", "10", "11"],
        threads: [],
        keystages: [],
      };

      render(
        <ProgrammeSequence
          {...missingUnitForLastYearFixtureWithProps}
          filters={filterFixture}
        />,
      );
      expect(
        await screen.findByText(/No 'sub-cat-1' units in this year group/i),
      ).toBeInTheDocument();
    });
  });

  describe("Primary phase", () => {
    test("No units for subject category in first year of phase", async () => {
      const missingUnitsForFirstYearPrimaryFixtureWithProps = {
        ...CurricVisualiserFixture,
        yearData: missingUnitsForFirstYearPrimaryFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["sub-cat-1"],
        tiers: [],
        years: ["1", "2", "3", "4", "5", "6"],
        threads: [],
        keystages: [],
      };

      render(
        <ProgrammeSequence
          {...missingUnitsForFirstYearPrimaryFixtureWithProps}
          filters={filterFixture}
        />,
      );
      expect(
        await screen.findAllByText(/'sub-cat-1' units start in Year 2/i),
      ).toHaveLength(1);
      const unitCards = await screen.findAllByTestId("card-listing-container");
      expect(unitCards).toHaveLength(5);
    });

    test("No units for consecutive years at the start of the primary phase", async () => {
      const missingConsecutiveUnitsAtStartPrimaryFixtureWithProps = {
        ...CurricVisualiserFixture,
        yearData: missingConsecutiveUnitsAtStartPrimaryFixture as YearData,
      };

      const filterFixture = {
        childSubjects: [],
        pathways: [],
        subjectCategories: ["sub-cat-1"],
        tiers: [],
        years: ["1", "2", "3", "4", "5", "6"],
        threads: [],
        keystages: [],
      };

      render(
        <ProgrammeSequence
          {...missingConsecutiveUnitsAtStartPrimaryFixtureWithProps}
          filters={filterFixture}
        />,
      );

      expect(
        await screen.findAllByText(/'sub-cat-1' units start in Year 4/i),
      ).toHaveLength(1);
      expect(
        await screen.findAllByText(/'sub-cat-1' units continue in Year 4/i),
      ).toHaveLength(2);
      const unitCards = await screen.findAllByTestId("card-listing-container");
      expect(unitCards).toHaveLength(3);
    });
  });
});

describe("Year group filter headings display correctly", () => {
  const baseFixture = {
    ...CurricVisualiserFixture,
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
          subjectCategories: ["all"],
          tiers: ["higher"],
          years: ["7", "8", "9", "10", "11"],
          threads: [],
          keystages: [],
          pathways: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          expect(yearHeading).toHaveTextContent(`Year ${year} units`);

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
          subjectCategories: ["all"],
          childSubjects: [],
          pathways: [],
          tiers: [],
          years: ["7"],
          threads: [],
          keystages: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          subjectCategories: ["biology"],
          childSubjects: [],
          pathways: [],
          tiers: [],
          years: ["7"],
          threads: [],
          keystages: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          subjectCategories: ["chemistry"],
          childSubjects: [],
          pathways: [],
          tiers: [],
          years: ["7"],
          threads: [],
          keystages: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          subjectCategories: ["physics"],
          childSubjects: [],
          pathways: [],
          tiers: [],
          years: ["7"],
          threads: [],
          keystages: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          keystages: [],
          pathways: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          keystages: [],
          pathways: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          keystages: [],
          pathways: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          keystages: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          years: ["11"],
          threads: [],
          keystages: [],
        };

        render(
          <ProgrammeSequence
            {...secondaryMathsFixture}
            filters={filterFixture}
          />,
        );

        const year11Container = await screen.findByTestId("year-non_core-11");
        const yearHeading11 =
          await within(year11Container).findByTestId("year-heading");
        expect(yearHeading11).toHaveTextContent("Year 11");
        const subheading11 =
          await within(year11Container).findByTestId("year-subheading");
        expect(subheading11).toHaveTextContent("Foundation");
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
          subjectCategories: ["reading-writing-and-oracy"],
          tiers: [],
          years: ["1"],
          threads: [],
          keystages: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          subjectCategories: ["biology"],
          tiers: [],
          years: ["1"],
          threads: [],
          keystages: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          subjectCategories: ["chemistry"],
          tiers: [],
          years: ["2"],
          threads: [],
          keystages: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          subjectCategories: ["physics"],
          tiers: [],
          years: ["3"],
          threads: [],
          keystages: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
          subjectCategories: ["all"],
          tiers: [],
          years: ["4"],
          threads: [],
          keystages: [],
        };

        const { container } = render(
          <ProgrammeSequence
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
