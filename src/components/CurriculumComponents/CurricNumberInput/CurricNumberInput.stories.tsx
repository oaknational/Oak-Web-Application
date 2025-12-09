import { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakJauntyAngleLabel,
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
        <OakBox $pa="spacing-24">
          <Story />
        </OakBox>
      </OakThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Component>;

function InteractiveWrapper(
  args: Readonly<React.ComponentProps<typeof Component>>,
) {
  const [value, setValue] = useState(args.value);
  return (
    <OakFlex $position="relative" $flexDirection="column">
      <OakJauntyAngleLabel
        as="label"
        htmlFor={args.id}
        label="Number of lessons"
        $font="heading-7"
        $background="bg-decorative5-main"
        $color="text-primary"
        $zIndex="in-front"
        $position="absolute"
        $top={"-20px"}
        $left={"5px"}
        $borderRadius="border-radius-square"
      />
      <Component {...args} value={value} onChange={setValue} />
    </OakFlex>
  );
}

function ValidationDemo() {
  const [value, setValue] = useState(30);
  const [isValid, setIsValid] = useState(true);

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakFlex $flexDirection="column" $gap="spacing-24">
        <OakFlex $position="relative" $flexDirection="column">
          <OakJauntyAngleLabel
            as="label"
            htmlFor="validated-input"
            label="Number of lessons"
            $font="heading-7"
            $background="bg-decorative5-main"
            $color="text-primary"
            $zIndex="in-front"
            $position="absolute"
            $top={"-20px"}
            $left={"5px"}
            $borderRadius="border-radius-square"
          />
          <Component
            id="validated-input"
            value={value}
            onChange={setValue}
            min={5}
            max={35}
            step={1}
            onValidationChange={setIsValid}
          />
        </OakFlex>
        <OakBox $pa="spacing-16">
          <OakP $font="body-2">
            Validation status: {isValid ? "✓ Valid" : "✗ Invalid"}
          </OakP>
          <OakP $font="body-3" $color="text-subdued">
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
      <OakFlex $flexDirection="column" $gap="spacing-48">
        <OakFlex $flexDirection="column" $gap="spacing-32">
          <OakHeading id="autumn-heading" tag="h3" $font="heading-3">
            Autumn
          </OakHeading>
          <OakFlex $position="relative" $flexDirection="column">
            <OakJauntyAngleLabel
              as="label"
              htmlFor="autumn-lessons"
              label="Number of lessons"
              $font="heading-7"
              $background="bg-decorative5-main"
              $color="text-primary"
              $zIndex="in-front"
              $position="absolute"
              $top={"-20px"}
              $left={"5px"}
              $borderRadius="border-radius-square"
            />
            <Component
              id="autumn-lessons"
              value={autumn}
              onChange={setAutumn}
              ariaDescribedBy="autumn-heading"
              min={5}
              max={35}
              step={1}
            />
          </OakFlex>
        </OakFlex>

        <OakFlex $flexDirection="column" $gap="spacing-32">
          <OakHeading id="spring-heading" tag="h3" $font="heading-3">
            Spring
          </OakHeading>
          <OakFlex $position="relative" $flexDirection="column">
            <OakJauntyAngleLabel
              as="label"
              htmlFor="spring-lessons"
              label="Number of lessons"
              $font="heading-7"
              $background="bg-decorative5-main"
              $color="text-primary"
              $zIndex="in-front"
              $position="absolute"
              $top={"-20px"}
              $left={"5px"}
              $borderRadius="border-radius-square"
            />
            <Component
              id="spring-lessons"
              value={spring}
              onChange={setSpring}
              ariaDescribedBy="spring-heading"
              min={5}
              max={35}
              step={1}
            />
          </OakFlex>
        </OakFlex>

        <OakFlex $flexDirection="column" $gap="spacing-32">
          <OakHeading id="summer-heading" tag="h3" $font="heading-3">
            Summer
          </OakHeading>
          <OakFlex $position="relative" $flexDirection="column">
            <OakJauntyAngleLabel
              as="label"
              htmlFor="summer-lessons"
              label="Number of lessons"
              $font="heading-7"
              $background="bg-decorative5-main"
              $color="text-primary"
              $zIndex="in-front"
              $position="absolute"
              $top={"-20px"}
              $left={"5px"}
              $borderRadius="border-radius-square"
            />
            <Component
              id="summer-lessons"
              value={summer}
              onChange={setSummer}
              ariaDescribedBy="summer-heading"
              min={5}
              max={35}
              step={1}
            />
          </OakFlex>
        </OakFlex>
      </OakFlex>
    </OakThemeProvider>
  );
}

export const Default: Story = {
  args: {
    id: "lessons-input",
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
    value: 30,
    min: 5,
    max: 35,
    step: 1,
    ariaDescribedBy: "term-heading",
  },
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakFlex $flexDirection="column" $gap="spacing-32">
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
