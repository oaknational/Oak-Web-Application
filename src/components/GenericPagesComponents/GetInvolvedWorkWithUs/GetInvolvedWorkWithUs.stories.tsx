import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { GetInvolvedWorkWithUs as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/GetInvolvedWorkWithUs",
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
    heading: "Work with us",
    text: [
      "We're a fast-paced and innovative team, working to support and inspire teachers to deliver great teaching, so every pupil benefits.",
      "All our roles are remote-first. If you want to be part of something unique that's making a difference to millions of children's lives, we'd love to hear from you.",
    ],
    permanentRolesLink:
      "https://app.beapplied.com/org/1574/oak-national-academy/",
    freelanceRolesLink:
      "https://app.beapplied.com/org/1767/oak-national-academy-freelancers",
    imageUrl:
      "https://res.cloudinary.com/oak-web-application/image/upload/v1764066578/about-us/team-huddle_zivgxj.png",
    imageAlt: "Team collaborating around a table",
    badges: [
      {
        url: "https://res.cloudinary.com/oak-web-application/image/upload/v1764066553/about-us/investor-in-people_eymeqv.svg",
        alt: "Investors in People Gold",
      },
      {
        url: "https://res.cloudinary.com/oak-web-application/image/upload/v1764066553/about-us/top-1-percent-logo_hyga8g.svg",
        alt: "Top 1% Employer Badge",
      },
      {
        url: "https://res.cloudinary.com/oak-web-application/image/upload/v1764066553/about-us/disability-confident_ym07wl.png",
        alt: "Disability Confident Committed",
      },
    ],
  },
  render: (args) => <Component {...args} />,
};
