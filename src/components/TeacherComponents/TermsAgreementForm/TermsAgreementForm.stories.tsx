import { Meta, StoryObj } from "@storybook/react";

import Component, {
  TermsAgreementFormProps,
} from "@/components/TeacherComponents/TermsAgreementForm";
import { useResourceFormState } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState";
import { CurriculumDownload } from "@/components/CurriculumComponents/CurriculumDownloads/CurriculumDownloads";

type Story = StoryObj<typeof Component>;

const meta: Meta<typeof Component> = {
  component: Component,
  parameters: {
    controls: {
      exclude: ["form", "setSchool", "handleEditDetailsCompletedClick"],
    },
  },
  render: (args) => {
    return <Wrapper {...args} />;
  },
};
export default meta;

export const TermsAgreementForm: Story = {
  args: {
    isLoading: false,
    showSavedDetails: false,
  },
};

const resources: CurriculumDownload[] = [];

const Wrapper = (args: TermsAgreementFormProps) => {
  const formState = useResourceFormState({
    curriculumResources: resources,
    type: "curriculum",
  });
  return <Component {...args} form={formState.form} />;
};
