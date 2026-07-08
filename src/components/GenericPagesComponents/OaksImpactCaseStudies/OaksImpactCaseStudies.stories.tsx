import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { OaksImpactCaseStudies as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/OaksImpactCaseStudies",
  argTypes: {},
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    caseStudies: [
      {
        heading: "Case study 1",
        href: "#",
        imageSrc: "https://res.cloudinary.com/oak-web-application/image/upload/v1698336490/sample.jpg",
      },
      {
        heading: "Case study 2",
        href: "#",
        imageSrc: "https://res.cloudinary.com/oak-web-application/image/upload/v1698336490/sample.jpg",
      },
      {
        heading: "Case study 3",
        href: "#",
        imageSrc: "https://res.cloudinary.com/oak-web-application/image/upload/v1698336490/sample.jpg",
      },
    ]
  },
  render: (args) => <Component {...args} />,
  
};
