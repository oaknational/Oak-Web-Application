import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { LessonAppearsIn as Component } from "./LessonAppearsIn";

import Flex from "@/components/Flex";
import MaxWidth from "@/components/MaxWidth/MaxWidth";

export default {
  title: "Lesson/Lesson Appears In",
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Flex $background={"pink50"}>
    <MaxWidth $pa={120}>
      <Component {...args} />
    </MaxWidth>
  </Flex>
);

export const LessonAppearsIn = Template.bind({});
LessonAppearsIn.args = {
  units: [
    {
      unitTitle: "Unit 1",
      unitSlug: "unit-slug",
      examboards: [
        {
          examboardTitle: "Edexcel",
          examboardSlug: "edexcel",
          subjectTitle: "Maths",
          subjectSlug: "maths",
          tiers: [
            {
              programmeSlug: "programme-slug",
              tierTitle: "Foundation",
              tierSlug: "foundation",
            },
            {
              programmeSlug: "programme-slug",
              tierTitle: "Higher",
              tierSlug: "higher",
            },
          ],
        },
        {
          examboardTitle: "AQA",
          examboardSlug: "aqa",
          subjectTitle: "Maths",
          subjectSlug: "maths",
          tiers: [
            {
              programmeSlug: "programme-slug",
              tierTitle: "Foundation",
              tierSlug: "foundation",
            },
            {
              programmeSlug: "programme-slug",
              tierTitle: "Higher",
              tierSlug: "higher",
            },
          ],
        },
      ],
    },
    {
      unitTitle: "Unit 2",
      unitSlug: "unit-slug",
      examboards: [
        {
          examboardTitle: "AQA",
          examboardSlug: "aqa",
          subjectTitle: "Maths",
          subjectSlug: "maths",
          tiers: [
            {
              programmeSlug: "programme-slug",
              tierTitle: "Foundation",
              tierSlug: "foundation",
            },
            {
              programmeSlug: "programme-slug",
              tierTitle: "Core",
              tierSlug: "core",
            },
            {
              programmeSlug: "programme-slug",
              tierTitle: "Higher",
              tierSlug: "higher",
            },
          ],
        },
      ],
    },
  ],
};
// LessonAppearsIn.parameters = {
//   backgrounds: {
//     default: "dark",
//   },
// };

// {
//     unitSlug: string;
//     examboardTitle?: string | null;
//     examboardSlug?: string | null;
//     subjectTitle: string;
//     subjectSlug: string;
//     tiers: {
//       programmeSlug: string;
//       tierTitle?: string | null;
//       tierSlug?: string | null;
//     }[];
//   }
