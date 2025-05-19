import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import CurriculumUnitCard from "../CurricUnitCard";

import { CurricYearCard as Component } from ".";

import { Unit } from "@/utils/curriculum/types";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    yearTitle: { control: "text" },
    yearSubheading: { control: "text" },
    isExamboard: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const DefaultWithoutSubheading: Story = {
  args: {
    yearTitle: "Year 10",
    isExamboard: true,
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args}>
          <div>Content for Year 10 Literature</div>
        </Component>
      </OakThemeProvider>
    );
  },
};

export const WithSubheading: Story = {
  args: {
    yearTitle: "Year 11",
    yearSubheading: "Physics",
    isExamboard: true,
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args}>
          <div>Content for Key Stage 4 Science</div>
        </Component>
      </OakThemeProvider>
    );
  },
};

export const CorePathway: Story = {
  args: {
    yearTitle: "Year 11",
    yearSubheading: "Core",
    isExamboard: false,
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args}>
          <div>Content for Year 11 Mathematics</div>
        </Component>
      </OakThemeProvider>
    );
  },
};

export const WithAdditionalContent: Story = {
  args: {
    yearTitle: "Year 11",
    yearSubheading: "Physics",
    isExamboard: true,
    additional: (
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        <CurriculumUnitCard
          unit={
            {
              title: "Mechanics",
              unit_options: [],
              connection_prior_unit_description: null,
              connection_future_unit_description: null,
              connection_future_unit_title: null,
              connection_prior_unit_title: null,
            } as unknown as Unit
          }
          index={0}
          isHighlighted={false}
          onClick={() => {}}
        />
        <CurriculumUnitCard
          unit={
            {
              title: "Waves and Electricity",
              unit_options: [],
              connection_prior_unit_description: null,
              connection_future_unit_description: null,
              connection_future_unit_title: null,
              connection_prior_unit_title: null,
            } as unknown as Unit
          }
          index={1}
          isHighlighted={false}
          onClick={() => {}}
        />
        <CurriculumUnitCard
          unit={
            {
              title: "Quantum Physics",
              unit_options: [],
              connection_prior_unit_description: null,
              connection_future_unit_description: null,
              connection_future_unit_title: null,
              connection_prior_unit_title: null,
            } as unknown as Unit
          }
          index={2}
          isHighlighted={false}
          onClick={() => {}}
        />
      </div>
    ),
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
