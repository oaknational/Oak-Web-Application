import {
  OakBox,
  OakBoxProps,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";

import FocusIndicatorComponent from ".";

const meta: Meta<typeof FocusIndicatorComponent> = {
  component: FocusIndicatorComponent,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof FocusIndicatorComponent>;

const TestComponent = (
  props: Pick<OakBoxProps, "$btlr" | "$btrr" | "$bblr" | "$bbrr"> = {},
) => {
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <div style={{ display: "flex" }}>
        <FocusIndicatorComponent {...props}>
          <OakBox {...props} $overflow={"hidden"} $ba={"border-solid-m"}>
            <button
              style={{
                background: "transparent",
                border: "none",
                fontSize: "larger",
                outline: "none",
              }}
            >
              Test
            </button>
          </OakBox>
        </FocusIndicatorComponent>
      </div>
    </OakThemeProvider>
  );
};

export const Square: Story = {
  render: TestComponent.bind(undefined, {}),
};

export const Rounded: Story = {
  render: TestComponent.bind(undefined, {
    $btlr: "border-radius-m",
    $btrr: "border-radius-m",
    $bblr: "border-radius-m",
    $bbrr: "border-radius-m",
  }),
};

export const RoundedRightSide: Story = {
  render: TestComponent.bind(undefined, {
    $btlr: "border-radius-square",
    $btrr: "border-radius-m",
    $bblr: "border-radius-square",
    $bbrr: "border-radius-m",
  }),
};

export const RoundedLeftSide: Story = {
  render: TestComponent.bind(undefined, {
    $btlr: "border-radius-m",
    $btrr: "border-radius-square",
    $bblr: "border-radius-m",
    $bbrr: "border-radius-square",
  }),
};
