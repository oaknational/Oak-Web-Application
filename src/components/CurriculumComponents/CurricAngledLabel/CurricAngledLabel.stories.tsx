import type { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CurricAngledLabel } from "./CurricAngledLabel";

const meta: Meta<typeof CurricAngledLabel> = {
  title: "Components/Curriculum/CurricAngledLabel",
  component: CurricAngledLabel,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "The content to display inside the angled label",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CurricAngledLabel>;

export const Default: Story = {
  args: {
    children: "maths year 1",
  },
};

export const InHeading: Story = {
  render: () => (
    <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
      Create your <CurricAngledLabel>history year 2</CurricAngledLabel>{" "}
      timetable
    </h1>
  ),
};

export const InParagraph: Story = {
  render: () => (
    <p style={{ fontSize: "1rem" }}>
      This is a <CurricAngledLabel>science year 4</CurricAngledLabel> label used
      in a paragraph.
    </p>
  ),
};
