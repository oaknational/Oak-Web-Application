import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakFlex,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { EyfsLessonGroupProvider } from "../EyfsLessonGroupProvider";
import { __setMockAuthState } from "../../../../../../../.storybook/mocks/clerk";

import { EyfsLessonCard } from "./EyfsLessonCard";

import type { EYFSLesson } from "@/node-lib/curriculum-api-2023/queries/eyfs/eyfsSchema";

const mockLessons: EYFSLesson[] = [
  {
    title: "Introduction to counting",
    slug: "introduction-to-counting",
    orderInUnit: 1,
    video: { muxPlaybackId: null, title: "Counting video" },
  },
  {
    title: "Number bonds to 10",
    slug: "number-bonds-to-10",
    orderInUnit: 2,
    video: { muxPlaybackId: null, title: "Number bonds video" },
  },
  {
    title: "Adding and subtracting",
    slug: "adding-and-subtracting",
    orderInUnit: 3,
    video: { muxPlaybackId: null, title: "Add and subtract video" },
  },
];

const mockLessonWithNullVideo: EYFSLesson = {
  title: "Lesson without video",
  slug: "lesson-without-video",
  orderInUnit: 1,
  video: { muxPlaybackId: null, title: null },
};

const mockLessonsWithLongTitles: EYFSLesson[] = [
  {
    title:
      "Exploring mathematical concepts through play-based learning activities and hands-on experiences",
    slug: "exploring-maths-through-play",
    orderInUnit: 1,
    video: { muxPlaybackId: null, title: "Play-based maths video" },
  },
  {
    title:
      "Developing early number sense and understanding of quantity through counting, comparing and ordering",
    slug: "developing-early-number-sense",
    orderInUnit: 2,
    video: { muxPlaybackId: null, title: "Number sense video" },
  },
  {
    title:
      "Building confidence with addition and subtraction within 20 using manipulatives and visual representations",
    slug: "addition-subtraction-within-20",
    orderInUnit: 3,
    video: { muxPlaybackId: null, title: "Add and subtract video" },
  },
];

const meta: Meta<typeof EyfsLessonCard> = {
  component: EyfsLessonCard,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <EyfsLessonGroupProvider>
          <OakFlex
            $flexDirection="column"
            $gap="spacing-24"
            $pa="spacing-24"
            $background="bg-neutral"
          >
            <Story />
          </OakFlex>
        </EyfsLessonGroupProvider>
      </OakThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof EyfsLessonCard>;

export const SignedIn: Story = {
  decorators: [
    (Story) => {
      __setMockAuthState({ isSignedIn: true });
      return <Story />;
    },
  ],
  args: {
    lesson: mockLessons[0],
  },
};

export const SignedOut: Story = {
  decorators: [
    (Story) => {
      __setMockAuthState({ isSignedIn: false });
      return <Story />;
    },
  ],
  args: {
    lesson: mockLessons[0],
  },
};

export const NoVideo: Story = {
  decorators: [
    (Story) => {
      __setMockAuthState({ isSignedIn: true });
      return <Story />;
    },
  ],
  args: {
    lesson: mockLessonWithNullVideo,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Lesson card when no video is available (muxPlaybackId is null). The Show/Hide video button is not rendered.",
      },
    },
  },
};

export const MultipleLessons: Story = {
  decorators: [
    (Story) => {
      __setMockAuthState({ isSignedIn: true });
      return <Story />;
    },
  ],
  render: () => (
    <OakFlex $flexDirection="column" $gap="spacing-20">
      {mockLessons.map((lesson) => (
        <EyfsLessonCard key={lesson.slug} lesson={lesson} />
      ))}
    </OakFlex>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Multiple lesson cards sharing video toggle state. Click 'Show video' on one card to expand it; opening another card's video will close the first.",
      },
    },
  },
};

export const MultipleLessonsWithLongTitles: Story = {
  decorators: [
    (Story) => {
      __setMockAuthState({ isSignedIn: true });
      return <Story />;
    },
  ],
  render: () => (
    <OakFlex $flexDirection="column" $gap="spacing-20">
      {mockLessonsWithLongTitles.map((lesson) => (
        <EyfsLessonCard key={lesson.slug} lesson={lesson} />
      ))}
    </OakFlex>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Lesson cards with long titles to test layout and text wrapping.",
      },
    },
  },
};
