import { Meta, StoryObj } from "@storybook/react";
import {
  OakBox,
  OakMaxWidth,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import Component from "./LessonOverviewMediaClips";

import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    learningCycleVideos: lessonMediaClipsFixtures().mediaClips,
  },
};
export default meta;

type Story = StoryObj<typeof Component>;

export const LessonOverviewMediaClips: Story = {
  args: {
    learningCycleVideos: lessonMediaClipsFixtures().mediaClips,
  },
  render: (args) => {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <OakMaxWidth>
          <OakBox>
            <Component {...args} />
          </OakBox>
        </OakMaxWidth>
      </OakThemeProvider>
    );
  },
};
