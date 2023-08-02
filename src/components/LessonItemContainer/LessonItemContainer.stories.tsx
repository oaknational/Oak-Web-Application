import type { Meta, StoryObj } from "@storybook/react";

import lessonOverviewFixture from "../../node-lib/curriculum-api/fixtures/lessonOverview.fixture";
import { P } from "../Typography";
import Flex from "../Flex";

import {
  LessonItemContainer,
  LessonItemContainerProps,
} from "./LessonItemContainer";

const lessonOverview = lessonOverviewFixture();

const props: LessonItemContainerProps = {
  title: "Slide deck",
  downloadable: true,
  curriculumData: lessonOverview,
};

const meta: Meta<typeof LessonItemContainer> = {
  title: "Element/Lesson Item Container",
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
