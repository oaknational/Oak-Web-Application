import type { Decorator, Meta, StoryObj } from "@storybook/nextjs";
import type { PostHog } from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

import { MaybeTeachWithOakCard } from "./TeachWithOakCard";

/** Stubs the PostHog client so the card's flag check is deterministic in Storybook. */
const withFeatureFlagVariant = (variant: string): Decorator => {
  const client = {
    getFeatureFlag: () => variant,
    onFeatureFlags: () => () => {},
  } as unknown as PostHog;

  return (Story) => (
    <PostHogProvider client={client}>
      <Story />
    </PostHogProvider>
  );
};

const meta = {
  title: "App/Programmes/Units/Lessons/TeachWithOakCard",
  component: MaybeTeachWithOakCard,
  tags: ["autodocs"],
  decorators: [withFeatureFlagVariant("teacher-tip")],
  args: {
    returnTo:
      "/teachers/programmes/maths-secondary-year-7/units/adding-and-subtracting/lessons/adding-integers",
  },
} satisfies Meta<typeof MaybeTeachWithOakCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;
