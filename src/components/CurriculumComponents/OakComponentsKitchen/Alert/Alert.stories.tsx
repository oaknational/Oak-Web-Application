import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

const TestComponent = () => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <Component type="info" message="Info example" />
      <Component type="neutral" message="Neutral example" />
      <Component type="success" message="Success example" />
      <Component type="alert" message="Alert example" />
      <Component type="error" message="Error example" />
    </OakThemeProvider>
  );
};

export const Alert: Story = {
  render: TestComponent,
};
