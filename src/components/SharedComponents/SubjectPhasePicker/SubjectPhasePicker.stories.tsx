import { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakFlex,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import Component from "./SubjectPhasePicker";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const KeyStageKeypad: Story = {
  render: () => {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <OakFlex $flexDirection={"column"} $pa="inner-padding-m">
          <Component {...curriculumPhaseOptions} />
        </OakFlex>
      </OakThemeProvider>
    );
  },
};
