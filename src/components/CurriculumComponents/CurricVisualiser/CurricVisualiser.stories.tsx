import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentProps } from "react";

// import { mockOptionalityUnit, mockUnitWhyThisWhyNow } from "./CurricUnitModalContent.fixtures";

import Component from "./CurricVisualiser";
import { noMissingUnitsFixture } from "./CurricVisualiser.fixtures";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

const curriculumVisualiserFixture: ComponentProps<typeof Component> = {
  threadOptions: [],
  filters: {
    years: ["7", "8", "9", "10", "11"],
    tiers: [],
    childSubjects: [],
    subjectCategories: [],
    threads: [],
    pathways: [],
  },
  ks4Options: [{ slug: "edexcel", title: "edexcel" }],
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
          national_curriculum_content: [],
          prior_knowledge_requirements: [],
        },
      ],
      childSubjects: [],
      tiers: [],
      subjectCategories: [],
      isSwimming: false,
      groupAs: null,
      pathways: [],
      nationalCurriculum: [],
    },
  },
  setVisibleMobileYearRefID: () => {},
  basePath: "/",
};

export const Basic: Story = {
  args: {
    ...curriculumVisualiserFixture,
    yearData: noMissingUnitsFixture,
  },
  render: function Render(args: ComponentProps<typeof Component>) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
