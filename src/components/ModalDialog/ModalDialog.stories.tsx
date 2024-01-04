import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { OverlayContainer, OverlayProvider } from "react-aria";

import IconButton from "../SharedComponents/Button/IconButton";

import Component from ".";

import Button from "@/components/SharedComponents/Button";
import Box from "@/components/SharedComponents/Box";

export default {
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
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

export const ModalDialog = Template.bind({});
ModalDialog.args = {
  size: "small",
};
