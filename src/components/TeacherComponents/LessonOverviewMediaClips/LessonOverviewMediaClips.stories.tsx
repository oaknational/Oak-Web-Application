import { Meta, StoryObj } from "@storybook/react";
import { JSX, useRef } from "react";
import {
  OakMaxWidth,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { LessonItemContainer } from "../LessonItemContainer";

import Component from "./LessonOverviewMediaClips";

import lessonMediaClipsFixtures, {
  additionalCycles,
} from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import { MediaClipListCamelCase } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    learningCycleVideos: { ...lessonMediaClipsFixtures().mediaClips },
  },
};
export default meta;

type Story = StoryObj<typeof Component>;

const LessonOverviewMediaClipsComponent = (
  args: JSX.IntrinsicAttributes & {
    learningCycleVideos: MediaClipListCamelCase | null;
    lessonSlug: string;
    unitSlug: string | null;
    programmeSlug: string | null;
    lessonOutline: { lessonOutline: string }[] | null;
    isPELesson: boolean;
    isMFL: boolean;
  },
) => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakMaxWidth>
        <LessonItemContainer
          title={"Demonstration videos"}
          ref={useRef(null)}
          anchorId="media-clips"
          isSpecialist={false}
          slugs={{
            lessonSlug: "lesson-slug",
            unitSlug: "unit-slug",
            programmeSlug: "programme-slug",
          }}
          pageLinks={[
            { anchorId: "media-clips", label: "Demonstration videos" },
          ]}
          displayMediaClipButton={true}
        >
          <Component {...args} />
        </LessonItemContainer>
      </OakMaxWidth>
    </OakThemeProvider>
  );
};

export const LessonOverviewMediaClips: Story = {
  args: {
    learningCycleVideos: {
      ...lessonMediaClipsFixtures().mediaClips,
      ...additionalCycles,
    },
    lessonSlug: "lesson-slug",
    lessonOutline: null,
    isPELesson: false,
  },
  render: (args) => <LessonOverviewMediaClipsComponent {...args} />,
};
