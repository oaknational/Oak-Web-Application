import { Meta, StoryObj } from "@storybook/nextjs";

import Component, {
  TermsAgreementFormProps,
} from "@/components/TeacherComponents/TermsAgreementForm";
import { useResourceFormState } from "@/components/TeacherComponents/hooks/downloadAndShareHooks/useResourceFormState";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import { DownloadType } from "@/components/CurriculumComponents/CurriculumDownloadView/helper";

type Story = StoryObj<typeof Component>;

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [AnalyticsDecorator],
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

const resources: DownloadType[] = [];

const Wrapper = (args: TermsAgreementFormProps) => {
  const formState = useResourceFormState({
    curriculumResources: resources,
    type: "curriculum",
  });
  return <Component {...args} form={formState.form} />;
};
