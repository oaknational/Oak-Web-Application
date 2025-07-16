import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import DesktopUnitFilters from "./DesktopUnitFilters";

const meta: Meta<typeof DesktopUnitFilters> = {
  component: DesktopUnitFilters,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DesktopUnitFilters>;

export const Default: Story = {
  render: (args) => <DesktopUnitFilters {...args} />,

  args: {
    yearGroups: [
      {
        yearTitle: "Year 10",
        yearSlug: "year-10",
        year: "10",
      },
      {
        yearTitle: "Year 11",
        yearSlug: "year-11",
        year: "11",
      },
    ],
    learningThemes: [
      {
        themeTitle: "Algebra",
        themeSlug: "algebra",
      },
      {
        themeTitle: "Geometry and Measure",
        themeSlug: "geometry-and-measure",
      },
      {
        themeTitle: "Number",
        themeSlug: "number",
      },
      {
        themeTitle: "Probability",
        themeSlug: "probability",
      },
      {
        themeTitle: "Ratio and Proportion",
        themeSlug: "ratio-and-proportion",
      },
      {
        themeTitle: "Statistics",
        themeSlug: "statistics",
      },
    ],
    subjectCategories: [
      {
        label: "Maths",
        iconName: "maths-icon",
        slug: "maths",
      },
      {
        label: "Science",
        iconName: "science-icon",
        slug: "science",
      },
    ],
    learningThemesId: "theme1",
  },
};
