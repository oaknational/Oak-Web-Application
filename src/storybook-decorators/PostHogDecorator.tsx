import { Story } from "@storybook/react";
import { PostHogProvider } from "posthog-js/react";
import posthog from "posthog-js";

export default function PostHogDecorator(Story: Story) {
  return (
    <div>
      <PostHogProvider client={posthog}>
        <Story />
      </PostHogProvider>
    </div>
  );
}
