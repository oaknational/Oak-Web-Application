import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakP, OakFlex } from "@oaknational/oak-components";

import {
  LessonItemContainer,
  LessonItemContainerProps,
} from "./LessonItemContainer";

import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";
import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";

const { lessonSlug, unitSlug, programmeSlug } = teachersLessonOverviewFixture();

const props: LessonItemContainerProps = {
  title: "Slide deck",
  downloadable: true,
  slugs: { lessonSlug, unitSlug, programmeSlug },
  anchorId: "slide-deck",
  pageLinks: [],
};

const meta: Meta<typeof LessonItemContainer> = {
  component: LessonItemContainer,
  decorators: [TeacherBrowseAnalyticsDecorator],
};

export default meta;

type Story = StoryObj<typeof LessonItemContainer>;

export const Standard: Story = {
  render: ({ ...args }) => (
    <LessonItemContainer {...args}>
      <OakFlex
        $justifyContent={"center"}
        $alignItems={"center"}
        $height="spacing-120"
      >
        <OakP>Inner content here</OakP>
      </OakFlex>
    </LessonItemContainer>
  ),
  args: { ...props },
};
