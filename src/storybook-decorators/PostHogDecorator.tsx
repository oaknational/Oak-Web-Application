import type { Decorator } from "@storybook/react";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";

const PostHogDecorator: Decorator = (Story) => {
  return (
    <PostHogProvider client={posthog}>
      <Story />
    </PostHogProvider>
  );
};

export default PostHogDecorator;
