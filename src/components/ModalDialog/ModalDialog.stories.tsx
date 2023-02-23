import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { OverlayContainer, OverlayProvider } from "react-aria";

import Button from "../Button";
import IconButton from "../Button/IconButton";
import Box from "../Box";

import Component from ".";

export default {
  title: "Modals/ModalDialog",
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
                background="teachersHighlight"
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
