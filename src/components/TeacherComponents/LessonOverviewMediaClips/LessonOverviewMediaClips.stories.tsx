import { Meta, StoryObj } from "@storybook/react";
import { JSX, useRef } from "react";
import {
  OakMaxWidth,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { LessonItemContainer } from "../LessonItemContainer";

import Component from "./LessonOverviewMediaClips";

import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import { MediaClipsList } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    learningCycleVideos: lessonMediaClipsFixtures().mediaClips,
  },
};
export default meta;

type Story = StoryObj<typeof Component>;

const LessonOverviewMediaClipsComponent = (
  args: JSX.IntrinsicAttributes & {
    learningCycleVideos: MediaClipsList;
    unitSlug: string | null;
    programmeSlug: string | null;
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
    learningCycleVideos: lessonMediaClipsFixtures().mediaClips,
  },
  render: (args) => <LessonOverviewMediaClipsComponent {...args} />,
};

export const LessThan4Cycles: Story = {
  args: {
    learningCycleVideos: {
      intro: [
        {
          order: 1,
          mediaId: 2321312,
          learningCycleTitle: "Learning cycle 3",
          mediaClipTitle: "Introduction physical exercise video",
          slug: "introduction-physical-exercise-video",
          mediaObject: null,
          mediaType: "video",
          videoId: 33,
          videoObject: {
            playbackPolicy: "signed",
            muxPlaybackId: "WfJkoCV01EvqXpkLiaY01axFcTk7O9nurFXrXxZgV02Q004",
            resourceType: "video",
            title: "Introduction physical exercise video",
            usageRestrictions: "No restrictions",
            attributionRequired: "No attribution required",
            duration: 180.34,
          },
        },
        {
          order: 2,
          mediaClipTitle: "Running",
          learningCycleTitle: "Learning cycle 3",
          slug: "running",
          mediaId: 137156,
          mediaObject: {
            muxPlaybackId: "KHUK004YVrDuBlZH1YK01J2KQw2AyxGwpy00l016qIO3jDU",
            playbackPolicy: "signed",
            resourceType: "audio",
            title: "Cycle 1 Audio",
            usageRestrictions: "No restrictions",
            attributionRequired: "No attribution required",
            duration: 180.34,
          },
          mediaType: "audio",
          videoId: null,
          videoObject: null,
        },
      ],
      cycle1: [
        {
          order: 1,
          mediaClipTitle: "Cycle 1 running video",
          slug: "cycle-1-running-video",
          learningCycleTitle: "Learning cycle 1",
          mediaId: 4332,
          mediaObject: null,
          mediaType: "video",
          videoId: 4,
          videoObject: {
            playbackPolicy: "signed",
            muxPlaybackId: "xnNJ4SyxV00cNer3TBej00JopgOSTJsF9ArTY6NAd6hFk",
            resourceType: "video",
            title: "Cycle 1 Video",
            usageRestrictions: "No restrictions",
            attributionRequired: "No attribution required",
            duration: 150,
          },
        },
        {
          order: 2,
          mediaClipTitle: "Cycle 1 Audio",
          learningCycleTitle: "Learning cycle 1",
          slug: "cycle-1-audio",
          mediaId: 137139,
          mediaObject: {
            duration: 180.34,
            playbackPolicy: "signed",
            muxPlaybackId: "KHUK004",
            resourceType: "audio",
            title: "Cycle 1 Audio",
            usageRestrictions: "No restrictions",
            attributionRequired: "No attribution required",
          },
          mediaType: "audio",
          videoId: 23,
          videoObject: null,
        },
      ],
    },
  },
  render: (args) => <LessonOverviewMediaClipsComponent {...args} />,
};

export const MoreThan4Cycles: Story = {
  args: {
    learningCycleVideos: {
      intro: [
        {
          order: 1,
          mediaId: 5643,
          learningCycleTitle: "Learning cycle 3",
          mediaClipTitle: "Introduction physical exercise video",
          slug: "introduction-physical-exercise-video",
          mediaObject: null,
          mediaType: "video",
          videoId: 33,
          videoObject: {
            playbackPolicy: "signed",
            muxPlaybackId: "WfJkoCV01EvqXpkLiaY01axFcTk7O9nurFXrXxZgV02Q004",
            resourceType: "video",
            title: "Introduction physical exercise video",
            usageRestrictions: "No restrictions",
            attributionRequired: "No attribution required",
            duration: 180.34,
          },
        },
      ],
      cycle1: [
        {
          order: 1,
          mediaClipTitle: "Cycle 1 running video",
          learningCycleTitle: "Learning cycle 1",
          slug: "cycle-1-running-video",
          mediaId: 78654,
          mediaObject: null,
          mediaType: "video",
          videoId: 4,
          videoObject: {
            playbackPolicy: "signed",
            muxPlaybackId: "xnNJ4SyxV00cNer3TBej00JopgOSTJsF9ArTY6NAd6hFk",
            resourceType: "video",
            title: "Cycle 1 Video",
            usageRestrictions: "No restrictions",
            attributionRequired: "No attribution required",
            duration: 150,
          },
        },
      ],
      cycle2: [
        {
          order: 1,
          mediaClipTitle: "Cycle 1 running video",
          learningCycleTitle: "Learning cycle 1",
          slug: "cycle-1-running-video",
          mediaId: 85432,
          mediaObject: null,
          mediaType: "video",
          videoId: 4,
          videoObject: {
            playbackPolicy: "signed",
            muxPlaybackId: "xnNJ4SyxV00cNer3TBej00JopgOSTJsF9ArTY6NAd6hFk",
            resourceType: "video",
            title: "Cycle 1 Video",
            usageRestrictions: "No restrictions",
            attributionRequired: "No attribution required",
            duration: 150,
          },
        },
      ],
      cycle3: [
        {
          order: 1,
          mediaClipTitle: "Cycle 1 running video",
          slug: "cycle-1-running-video",
          learningCycleTitle: "Learning cycle 1",
          mediaId: 68432,
          mediaObject: null,
          mediaType: "video",
          videoId: 4,
          videoObject: {
            playbackPolicy: "signed",
            muxPlaybackId: "xnNJ4SyxV00cNer3TBej00JopgOSTJsF9ArTY6NAd6hFk",
            resourceType: "video",
            title: "Cycle 1 Video",
            usageRestrictions: "No restrictions",
            attributionRequired: "No attribution required",
            duration: 150,
          },
        },
      ],
      cycle4: [
        {
          order: 1,
          mediaClipTitle: "Cycle 1 running video",
          slug: "cycle-1-running-video",
          learningCycleTitle: "Learning cycle 1",
          mediaId: 4994,
          mediaObject: null,
          mediaType: "video",
          videoId: 4,
          videoObject: {
            playbackPolicy: "signed",
            muxPlaybackId: "xnNJ4SyxV00cNer3TBej00JopgOSTJsF9ArTY6NAd6hFk",
            resourceType: "video",
            title: "Cycle 1 Video",
            usageRestrictions: "No restrictions",
            attributionRequired: "No attribution required",
            duration: 150,
          },
        },
      ],
      cycle5: [
        {
          order: 1,
          mediaClipTitle: "Cycle 1 running video",
          slug: "cycle-1-running-video",
          learningCycleTitle: "Learning cycle 1",
          mediaId: 6954,
          mediaObject: null,
          mediaType: "video",
          videoId: 4,
          videoObject: {
            playbackPolicy: "signed",
            muxPlaybackId: "xnNJ4SyxV00cNer3TBej00JopgOSTJsF9ArTY6NAd6hFk",
            resourceType: "video",
            title: "Cycle 1 Video",
            usageRestrictions: "No restrictions",
            attributionRequired: "No attribution required",
            duration: 150,
          },
        },
      ],
      cycle6: [
        {
          order: 1,
          mediaClipTitle: "Cycle 1 running video",
          slug: "cycle-1-running-video",
          learningCycleTitle: "Learning cycle 1",
          mediaId: 6943,
          mediaObject: null,
          mediaType: "video",
          videoId: 4,
          videoObject: {
            playbackPolicy: "signed",
            muxPlaybackId: "xnNJ4SyxV00cNer3TBej00JopgOSTJsF9ArTY6NAd6hFk",
            resourceType: "video",
            title: "Cycle 1 Video",
            usageRestrictions: "No restrictions",
            attributionRequired: "No attribution required",
            duration: 150,
          },
        },
      ],
    },
  },
  render: (args) => <LessonOverviewMediaClipsComponent {...args} />,
};
