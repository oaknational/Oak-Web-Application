import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, userEvent, within } from "storybook/test";
import { useState } from "react";
import { OakFlex, OakSecondaryButton } from "@oaknational/oak-components";

import { hubData, subjectData } from "../__fixtures__/stories";

import { NationalCurriculumInsightsDownload } from "./Download";

const meta = {
  component: NationalCurriculumInsightsDownload,
  parameters: { layout: "fullscreen" },
  args: {
    data: hubData,
    section: {
      __typename: "NationalCurriculumInsightsDownloadSection",
      barHeading: "The national curriculum is changing.",
      barCtaLabel: "Download free expert guidance.",
      detailsHeading: "Your details",
      downloadsHeading: "Choose your subjects",
      downloadsIntroduction: "Select the subjects and phases you need.",
      downloadButtonLabel: "Download",
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsDownload>;

export default meta;
type Story = StoryObj<typeof meta>;

const SelectionNavigation = (args: typeof meta.args) => {
  const [subjectSlug, setSubjectSlug] = useState("history");
  const subjects = ["history", "music", "maths", "drama", "geography"].map(
    (slug) => ({
      ...hubData.subjects[0]!,
      slug,
      title: slug[0]!.toUpperCase() + slug.slice(1),
      tabs: [hubData.subjects[0]!.tabs[0]!],
    }),
  );
  return (
    <>
      <OakFlex
        as="nav"
        aria-label="Example subject pages"
        $gap="spacing-16"
        $pa="spacing-24"
      >
        {["history", "music"].map((slug) => (
          <OakSecondaryButton key={slug} onClick={() => setSubjectSlug(slug)}>
            {slug === "history" ? "History page" : "Music page"}
          </OakSecondaryButton>
        ))}
      </OakFlex>
      <NationalCurriculumInsightsDownload
        {...args}
        key={subjectSlug}
        data={{ ...hubData, subjects, route: { kind: "subject", subjectSlug } }}
      />
    </>
  );
};

export const Collapsed: Story = {};
export const Expanded: Story = {
  args: { data: subjectData },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", {
      name: /The national curriculum is changing/,
    });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(
      canvas.getByRole("textbox", { name: "Name (required)" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Download 2 insights (.ZIP)" }),
    ).toBeDisabled();
  },
};

export const SubjectNavigation: Story = {
  render: (args) => <SelectionNavigation {...args} />,
};
