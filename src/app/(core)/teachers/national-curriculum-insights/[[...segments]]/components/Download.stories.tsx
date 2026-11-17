import type { Meta, StoryObj } from "@storybook/nextjs";
import { expect, userEvent, within } from "storybook/test";
import { useState } from "react";
import { OakFlex, OakSecondaryButton } from "@oaknational/oak-components";

import { hubData, subjectData } from "../__fixtures__/stories";

import { NationalCurriculumInsightsDownload } from "./Download";

import { requestNationalCurriculumInsightsDownload } from "@/common-lib/urls/nationalCurriculumInsightsDownload";

const meta = {
  component: NationalCurriculumInsightsDownload,
  parameters: { layout: "fullscreen" },
  args: {
    data: hubData,
    section: {
      __typename: "NationalCurriculumInsightsDownloadSection",
      barHeading: "Planning with your team?",
      barCtaLabel: "Download this guidance and checklists.",
      detailsHeading: "Your details",
      downloadsHeading: "Download this guidance and the checklists",
      downloadsIntroduction:
        "Choose your subject(s) to get a version you can print and share at your next team meeting.",
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
      name: /Planning with your team/,
    });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    if (!canvas.queryByRole("textbox", { name: "Name (required)" })) {
      await userEvent.click(
        canvas.getByTestId("curriculum-insights-subjects-mobile-confirm"),
      );
    }
    await expect(
      canvas.getByRole("textbox", { name: "Name (required)" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Download 2 documents (.DOCX)" }),
    ).toBeDisabled();
  },
};

export const SubjectNavigation: Story = {
  render: (args) => <SelectionNavigation {...args} />,
};

export const ChecklistTrigger: Story = {
  args: { data: subjectData },
  render: (args) => (
    <>
      <OakFlex $pa="spacing-24">
        <OakSecondaryButton
          onClick={(event) =>
            requestNationalCurriculumInsightsDownload(event.currentTarget)
          }
        >
          Download this checklist
        </OakSecondaryButton>
      </OakFlex>
      <NationalCurriculumInsightsDownload {...args} />
    </>
  ),
};
