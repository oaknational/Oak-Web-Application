import {
  OakBox,
  OakFlex,
  OakInlineBanner,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";

import CurricUnitCard from "../CurricUnitCard";
import { CurricTermCard } from "../CurricTermCard";

import { CurricTimetablingYearCard as Component } from ".";

import { createUnit } from "@/fixtures/curriculum/unit";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    yearTitle: { control: "text" },
    yearSubheading: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

function StubUnit() {
  return (
    <CurricUnitCard
      key={0}
      unit={createUnit({ slug: "mechanics" })}
      index={0}
      isHighlighted={false}
      href={""}
    />
  );
}

export const WithCurricTermCard: Story = {
  args: {
    yearTitle: "Year 11",
    yearSubheading: "Physics",
    additional: (
      <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
        <OakInlineBanner
          isOpen={true}
          message={
            <OakBox>
              <strong>You’re 1 lesson short:</strong> the Year 1 curriculum has
              more lessons than your schedule allows. Use the orange (!) markers
              to help you decide which lesson to skip.
            </OakBox>
          }
        />
        <CurricTermCard
          title="Autumn Term"
          coveredNumberOfLessons={12}
          totalNumberOfLessons={14}
        >
          <StubUnit />
        </CurricTermCard>

        <CurricTermCard
          title="Spring Term"
          coveredNumberOfLessons={12}
          totalNumberOfLessons={14}
        >
          <StubUnit />
        </CurricTermCard>

        <CurricTermCard
          title="Summer Term"
          coveredNumberOfLessons={12}
          totalNumberOfLessons={14}
        >
          <StubUnit />
        </CurricTermCard>
      </OakFlex>
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
