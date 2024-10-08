import React, { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { OverlayContainer, OverlayProvider } from "react-aria";

import Component from ".";

import IconButton from "@/components/SharedComponents/Button/IconButton";
import Button from "@/components/SharedComponents/Button";
import Box from "@/components/SharedComponents/Box";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <OverlayProvider>
      <Button
        label="Open modal"
        icon="arrow-right"
        $iconPosition="trailing"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <OverlayContainer>
          <Component {...args}>
            <Box $position={"absolute"} $top={32} $right={32}>
              <IconButton
                icon="cross"
                onClick={() => setIsOpen(false)}
                aria-label="close modal"
                background="blue"
              />
            </Box>
          </Component>
        </OverlayContainer>
      )}
    </OverlayProvider>
  );
};

export const BioCardListModalDialog = {
  render: Template,

  args: {
    size: "small",
  },
};
