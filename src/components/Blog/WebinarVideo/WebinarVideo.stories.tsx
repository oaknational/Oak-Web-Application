import { ComponentStory, ComponentMeta } from "@storybook/react";

import Box from "../../Box";
import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";
import { useWebinarRegistration } from "../WebinarRegistration";
import Button from "../../Button";

import Component from ".";

export default {
  title: "Blogs & Webinars/WebinarVideo",
  component: Component,
  decorators: [
    AnalyticsDecorator,
    (Story) => (
      <Box $position="relative" $maxWidth={720} $ma="auto">
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    argTypes: { onSubmit: { action: "submitted" } },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const { webinarLockState, setWebinarsUnlocked } = useWebinarRegistration();
  return (
    <>
      <Box $mb={32}>
        {webinarLockState === "locked" ? (
          "Fill out and submit the form below to reveal the video component."
        ) : (
          <Button
            variant="minimal"
            onClick={() => setWebinarsUnlocked(false)}
            label="Click to reset"
          />
        )}
      </Box>
      <Component {...args} />
    </>
  );
};

export const WebinarVideo = Template.bind({});
WebinarVideo.args = {
  webinar: {
    video: {
      video: {
        asset: {
          assetId: "123",
          playbackId: "wgjCIRWRr00OSum34AWeU87lmSSCtNjEOViD9X5YSG8k",
          thumbTime: 25,
        },
      },
      title: "Test video",
    },
  },
};
