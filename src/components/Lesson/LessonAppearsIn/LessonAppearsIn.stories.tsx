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
  subjects: [
    {
      subjectTitle: "Combined Science",
      subjectSlug: "combined-science",
      units: [
        {
          unitTitle: "Measuring waves",
          unitSlug: "measuring-waves",
          examBoards: [
            {
              examBoardTitle: "AQA",
              examBoardSlug: "aqa",
              subjectTitle: "Combined Science",
              subjectSlug: "combined-science",
              tiers: [
                {
                  programmeSlug:
                    "combined-science-secondary-ks4-foundation-aqa",
                  tierTitle: "foundation",
                  tierSlug: null,
                },
                {
                  programmeSlug: "combined-science-secondary-ks4-higher-aqa",
                  tierTitle: "higher",
                  tierSlug: null,
                },
              ],
            },
            {
              examBoardTitle: "Edexcel",
              examBoardSlug: "edexcel",
              subjectTitle: "Combined Science",
              subjectSlug: "combined-science",
              tiers: [
                {
                  programmeSlug:
                    "combined-science-secondary-ks4-foundation-edexcel",
                  tierTitle: "foundation",
                  tierSlug: null,
                },
                {
                  programmeSlug:
                    "combined-science-secondary-ks4-higher-edexcel",
                  tierTitle: "higher",
                  tierSlug: null,
                },
              ],
            },
            {
              examBoardTitle: "OCR",
              examBoardSlug: "ocr",
              subjectTitle: "Combined Science",
              subjectSlug: "combined-science",
              tiers: [
                {
                  programmeSlug:
                    "combined-science-secondary-ks4-foundation-ocr",
                  tierTitle: "foundation",
                  tierSlug: null,
                },
                {
                  programmeSlug: "combined-science-secondary-ks4-higher-ocr",
                  tierTitle: "higher",
                  tierSlug: null,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      subjectTitle: "Physics",
      subjectSlug: "physics",
      units: [
        {
          unitTitle: "Measuring waves",
          unitSlug: "measuring-waves",
          examBoards: [
            {
              examBoardTitle: "AQA",
              examBoardSlug: "aqa",
              subjectTitle: "Physics",
              subjectSlug: "physics",
              tiers: [
                {
                  programmeSlug: "physics-secondary-ks4-foundation-aqa",
                  tierTitle: "foundation",
                  tierSlug: null,
                },
                {
                  programmeSlug: "physics-secondary-ks4-higher-aqa",
                  tierTitle: "higher",
                  tierSlug: null,
                },
              ],
            },
            {
              examBoardTitle: "Edexcel",
              examBoardSlug: "edexcel",
              subjectTitle: "Physics",
              subjectSlug: "physics",
              tiers: [
                {
                  programmeSlug: "physics-secondary-ks4-foundation-edexcel",
                  tierTitle: "foundation",
                  tierSlug: null,
                },
                {
                  programmeSlug: "physics-secondary-ks4-higher-edexcel",
                  tierTitle: "higher",
                  tierSlug: null,
                },
              ],
            },
            {
              examBoardTitle: "OCR",
              examBoardSlug: "ocr",
              subjectTitle: "Physics",
              subjectSlug: "physics",
              tiers: [
                {
                  programmeSlug: "physics-secondary-ks4-foundation-ocr",
                  tierTitle: "foundation",
                  tierSlug: null,
                },
                {
                  programmeSlug: "physics-secondary-ks4-higher-ocr",
                  tierTitle: "higher",
                  tierSlug: null,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
