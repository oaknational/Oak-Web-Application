import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  LessonOverviewVideo,
  LessonOverviewVideoProps,
} from "./LessonOverviewVideo";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

const transcriptSentences = [
  "Hi, I'm Rebecca, your computing teacher for the collaborating online respectfully unit.",
  "Now, this unit is all about learning how to work with others online, in a safe and respectful way.",
  "For this lesson, you're going to need a pen and paper, and you're also going to need to move any distractions out of the way that you can just so that you can really focus today.",
  "So, once you've done all of those things we can begin.",
  "In this lesson, you will evaluate effective passwords, evaluate appropriate usernames and describe and assess the benefits and the potential risks of sharing information online.",
  "So, to get you started, what makes a password secure?",
  "What advice can you give someone about creating a secure password?",
  "So, using your pen and paper, I want you to pause the video and make a list of points.",
  "So, how can you make your password secure?",
  "The National Cyber Security Centre advises that your password should include three random words.",
  "You can even add special characters and numbers to your password to make it more secure.",
  "Here is an example of a secure password, and notice, you've got a number, either side, and you've got three random words in the middle there.",
];

const props: LessonOverviewVideoProps = {
  video: "video",
  title: "title",
  transcriptSentences,
  signLanguageVideo: "signLanguageVideo",
  isLegacy: true,
};

const meta: Meta<typeof LessonOverviewVideo> = {
  component: LessonOverviewVideo,
  decorators: [AnalyticsDecorator, (Story) => <Story />],
};

export default meta;

type Story = StoryObj<typeof LessonOverviewVideo>;

export const Standard: Story = {
  render: ({ ...args }) => <LessonOverviewVideo {...args} />,
  args: { ...props },
};
