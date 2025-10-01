import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";
import { useRef } from "react";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

const TestComponent = () => {
  const startRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLButtonElement>(null);
  const onWrapStart = () => {
    console.log("onWrapStart");
    endRef.current?.focus();
  };
  const onWrapEnd = () => {
    console.log("onWrapEnd");
    startRef.current?.focus();
  };
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Component onWrapStart={onWrapStart} onWrapEnd={onWrapEnd}>
        <button ref={startRef}>one</button>
        <button>two</button>
        <button ref={endRef}>three</button>
      </Component>
    </OakThemeProvider>
  );
};

export const FocusWrap: Story = {
  render: TestComponent,
};
