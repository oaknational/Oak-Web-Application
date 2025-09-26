import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakP, OakFlex } from "@oaknational/oak-components";

import {
  LessonItemContainer,
  LessonItemContainerProps,
} from "./LessonItemContainer";

import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";

const { lessonSlug, unitSlug, programmeSlug } = lessonOverviewFixture();

const props: LessonItemContainerProps = {
  title: "Slide deck",
  downloadable: true,
  isSpecialist: false,
  slugs: { lessonSlug, unitSlug, programmeSlug },
  anchorId: "slide-deck",
  pageLinks: [],
};

const meta: Meta<typeof LessonItemContainer> = {
  component: LessonItemContainer,
};

export default meta;

type Story = StoryObj<typeof LessonItemContainer>;

export const Standard: Story = {
  render: ({ ...args }) => (
    <LessonItemContainer {...args}>
      <OakFlex
        $justifyContent={"center"}
        $alignItems={"center"}
        $height="all-spacing-16"
      >
        <OakP>Inner content here</OakP>
      </OakFlex>
    </LessonItemContainer>
  ),
  args: { ...props },
};
