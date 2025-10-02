import { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakP,
  oakDefaultTheme,
  OakThemeProvider,
} from "@oaknational/oak-components";
import { useState } from "react";

import { CurricNumberInput as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/CurriculumComponents/CurricNumberInput",
  argTypes: {
    id: {
      control: "text",
      description: "The unique identifier for the input",
    },
    label: {
      control: "text",
      description: "The label text displayed on the jaunty angle label",
    },
    value: {
      control: "number",
      description: "The current value of the input",
    },
    min: {
      control: "number",
      description: "Minimum value allowed",
    },
    max: {
      control: "number",
      description: "Maximum value allowed",
    },
    step: {
      control: "number",
      description: "Step value for number input",
    },
    ariaDescribedBy: {
      control: "text",
      description: "The ID of the element that describes this input",
    },
  },
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <OakBox $pa="inner-padding-xl">
          <Story />
        </OakBox>
      </OakThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Component>;

function InteractiveWrapper(args: React.ComponentProps<typeof Component>) {
  const [value, setValue] = useState(args.value);
  return <Component {...args} value={value} onChange={setValue} />;
}

function ValidationDemo() {
  const [value, setValue] = useState(30);
  const [isValid, setIsValid] = useState(true);

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakFlex $flexDirection="column" $gap="space-between-m">
        <Component
          id="validated-input"
          label="Number of lessons"
          value={value}
          onChange={setValue}
          min={5}
          max={35}
          step={1}
          onValidationChange={setIsValid}
        />
        <OakBox $pa="inner-padding-m">
          <OakP $font="body-2">
            Validation status: {isValid ? "✓ Valid" : "✗ Invalid"}
          </OakP>
          <OakP $font="body-3" $color="grey60">
            Try entering a value outside the range (5-35) to see error feedback
          </OakP>
        </OakBox>
      </OakFlex>
    </OakThemeProvider>
  );
}

function MultipleInputsDemo() {
  const [autumn, setAutumn] = useState(30);
  const [spring, setSpring] = useState(30);
  const [summer, setSummer] = useState(30);

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakFlex $flexDirection="column" $gap="space-between-l">
        <OakFlex $flexDirection="column" $gap="space-between-m2">
          <OakHeading id="autumn-heading" tag="h3" $font="heading-3">
            Autumn
          </OakHeading>
          <Component
            id="autumn-lessons"
            label="Number of lessons"
            value={autumn}
            onChange={setAutumn}
            ariaDescribedBy="autumn-heading"
            min={5}
            max={35}
            step={1}
          />
        </OakFlex>

        <OakFlex $flexDirection="column" $gap="space-between-m2">
          <OakHeading id="spring-heading" tag="h3" $font="heading-3">
            Spring
          </OakHeading>
          <Component
            id="spring-lessons"
            label="Number of lessons"
            value={spring}
            onChange={setSpring}
            ariaDescribedBy="spring-heading"
            min={5}
            max={35}
            step={1}
          />
        </OakFlex>

        <OakFlex $flexDirection="column" $gap="space-between-m2">
          <OakHeading id="summer-heading" tag="h3" $font="heading-3">
            Summer
          </OakHeading>
          <Component
            id="summer-lessons"
            label="Number of lessons"
            value={summer}
            onChange={setSummer}
            ariaDescribedBy="summer-heading"
            min={5}
            max={35}
            step={1}
          />
        </OakFlex>
      </OakFlex>
    </OakThemeProvider>
  );
}

export const Default: Story = {
  args: {
    id: "lessons-input",
    label: "Number of lessons",
    value: 30,
    min: 5,
    max: 35,
    step: 1,
  },
  render: (args) => <InteractiveWrapper {...args} />,
};

export const MinimumValue: Story = {
  args: {
    id: "lessons-min",
    label: "Number of lessons",
    value: 5,
    min: 5,
    max: 35,
    step: 1,
  },
  render: (args) => <InteractiveWrapper {...args} />,
};

export const MaximumValue: Story = {
  args: {
    id: "lessons-max",
    label: "Number of lessons",
    value: 35,
    min: 5,
    max: 35,
    step: 1,
  },
  render: (args) => <InteractiveWrapper {...args} />,
};

export const CustomRange: Story = {
  args: {
    id: "lessons-custom",
    label: "Number of lessons",
    value: 50,
    min: 20,
    max: 100,
    step: 5,
  },
  render: (args) => <InteractiveWrapper {...args} />,
};

export const WithDescription: Story = {
  args: {
    id: "lessons-described",
    label: "Number of lessons",
    value: 30,
    min: 5,
    max: 35,
    step: 1,
    ariaDescribedBy: "term-heading",
  },
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakFlex $flexDirection="column" $gap="space-between-m2">
        <OakHeading id="term-heading" tag="h3" $font="heading-3">
          Autumn Term
        </OakHeading>
        <InteractiveWrapper {...args} />
      </OakFlex>
    </OakThemeProvider>
  ),
};

export const MultipleInputs: Story = {
  render: () => <MultipleInputsDemo />,
};

export const SmallStep: Story = {
  args: {
    id: "lessons-small-step",
    label: "Number of lessons",
    value: 30,
    min: 5,
    max: 35,
    step: 0.5,
  },
  render: (args) => <InteractiveWrapper {...args} />,
};

export const LargeStep: Story = {
  args: {
    id: "lessons-large-step",
    label: "Number of lessons",
    value: 30,
    min: 5,
    max: 35,
    step: 5,
  },
  render: (args) => <InteractiveWrapper {...args} />,
};

export const WithValidation: Story = {
  render: () => <ValidationDemo />,
};
