import React, { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { OverlayContainer, OverlayProvider } from "react-aria";
import { OakBox } from "@oaknational/oak-components";

import Component from ".";

import IconButton from "@/components/SharedComponents/Button/IconButton";
import Button from "@/components/SharedComponents/Button";

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
            <OakBox
              $position={"absolute"}
              $top={"all-spacing-7"}
              $right={"all-spacing-7"}
            >
              <IconButton
                icon="cross"
                onClick={() => setIsOpen(false)}
                aria-label="close modal"
                background="blue"
              />
            </OakBox>
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
