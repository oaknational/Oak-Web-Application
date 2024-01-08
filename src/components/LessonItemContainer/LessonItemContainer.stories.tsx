import type { Meta, StoryObj } from "@storybook/react";

import {
  LessonItemContainer,
  LessonItemContainerProps,
} from "./LessonItemContainer";

import { P } from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";
import lessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/lessonOverview.fixture";

const { lessonSlug, unitSlug, programmeSlug } = lessonOverviewFixture();

const props: LessonItemContainerProps = {
  title: "Slide deck",
  downloadable: true,
  slugs: { lessonSlug, unitSlug, programmeSlug },
  anchorId: "slide-deck",
};

const meta: Meta<typeof LessonItemContainer> = {
  component: LessonItemContainer,
};

export default meta;

type Story = StoryObj<typeof LessonItemContainer>;

export const Standard: Story = {
  render: ({ ...args }) => (
    <LessonItemContainer {...args}>
      <Flex $justifyContent={"center"} $alignItems={"center"} $height={[110]}>
        <P>Inner content here</P>
      </Flex>
    </LessonItemContainer>
  ),
  args: { ...props },
};
