import { Meta, StoryObj } from "@storybook/nextjs";

import Component from ".";

import { resolveOakHref } from "@/common-lib/urls";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof Component>;

export const SpecialistProgrammeHeaderListing: Story = {
  args: {
    title: "Specialist & therapies",
    breadcrumbs: [
      {
        href: resolveOakHref({ page: "home" }),
        label: "Home",
      },
      {
        href: resolveOakHref({
          page: "specialist-subject-index",
        }),
        label: "Specialist and therapies",
      },
      {
        href: resolveOakHref({
          page: "specialist-programme-index",
          subjectSlug: "communication-and-language",
        }),
        label: "Communication and Language",
      },
    ],
    description:
      "Help your pupils with their communication and language development, including sentence composition, writing and word reading skills by exploring topics including holidays and the seasons.",
    hasCurriculumDownload: true,
    subjectSlug: "communication-and-language",
    subjectTitle: "Communication and language",
  },
};
