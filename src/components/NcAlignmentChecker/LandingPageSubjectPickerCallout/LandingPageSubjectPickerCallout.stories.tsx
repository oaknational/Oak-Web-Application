import type { Meta } from "@storybook/react";

import SubjectPickerCallout from "./LandingPageSubjectPickerCallout";

import { basicSubjectPickerFormFixture } from "@/components/NcAlignmentChecker/SubjectPickerForm/SubjectPickerForm.fixtures";

const meta = {
  component: SubjectPickerCallout,
  title: "Components/NcAlignmentChecker/SubjectPickerCallout",
  tags: ["autodocs"],
} satisfies Meta<typeof SubjectPickerCallout>;

export default meta;

export const Default = {
  args: {
    subjectPicker: { ...basicSubjectPickerFormFixture },
  },
};
