import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakFlex } from "@oaknational/oak-components";

import { storyPortableText } from "../../__fixtures__/stories";

import { NationalCurriculumInsightsConfidence } from "./Confidence";

const paragraphs = (content: string[]) =>
  content.flatMap((text, index) =>
    storyPortableText(text).map((block) => ({
      ...block,
      _key: `paragraph-${index}`,
    })),
  );

const meta = {
  component: NationalCurriculumInsightsConfidence,
  parameters: { layout: "fullscreen" },
  args: {
    section: {
      __typename: "NationalCurriculumInsightsConfidenceSection",
      heading: "Prepare with confidence using Oak",
      bodyPortableText: paragraphs([
        "Curriculum improvement doesn't need to wait until 2028. Use Oak to refresh the areas of your curriculum or teaching that need it now. Along the way, you’ll get to know our curriculum plans and resources and how to adapt them for your pupils. So when bigger changes come, you'll have a strong starting point to build on.",
        "Our free, adaptable resources cover every national curriculum subject from KS1-4, and already reflect many of the proposed changes. You'll find oracy woven into English, financial education in citizenship and maths, media literacy in RSHE, and climate and sustainability in geography and science.",
        "As the new programmes of study are confirmed, we'll have updated resources ready for you well before you need them in the classroom. So you can keep building on what works, with the confidence that comes from already knowing your way around Oak, as you prepare for September 2028 and the updated GCSEs that follow.",
      ]),
      cta: {
        label: "Explore curriculum plans",
        linkType: "external",
        external:
          "https://www.thenational.academy/teachers/curriculum/history-primary/overview",
      },
    },
  },
  render: (args) => (
    <OakFlex $pt="spacing-80" $width="100%" $maxWidth="spacing-960">
      <NationalCurriculumInsightsConfidence {...args} />
    </OakFlex>
  ),
} satisfies Meta<typeof NationalCurriculumInsightsConfidence>;
export default meta;
type Story = StoryObj<typeof meta>;
export const CurrentCopy: Story = {};
export const FigmaReference: Story = {
  args: {
    section: {
      ...meta.args.section,
      bodyPortableText: paragraphs([
        "Our free, subject expert-designed KS1-4 curriculum plans and resources are ready to use and adapt today. They are aligned to the current national curriculum, and already reflect many of the review’s recommendations, so you can start shaping your curriculum for what comes next. For example, you’ll already see oracy embedded into our English curriculum; financial literacy in citizenship and maths; media literacy in RSHE; and climate sustainability in geography and science. ",
        "We’ll update all our resources to help you prepare confidently and reduce workload ahead of the refreshed national curriculum in September 2028, and the updated GCSEs that follow.",
      ]),
    },
  },
};
