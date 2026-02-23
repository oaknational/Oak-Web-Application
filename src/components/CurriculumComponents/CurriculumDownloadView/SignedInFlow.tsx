import {
  OakBox,
  OakPrimaryButton,
  OakFieldError,
  OakP,
  OakGrid,
  OakGridArea,
} from "@oaknational/oak-components";
import { useId, useState } from "react";
import { useUser } from "@clerk/nextjs";

import Terms from "../OakComponentsKitchen/Terms";

import { DownloadType, School } from "./helper";
import { CurriculumDownloadSelection } from "./CurriculumDownloadSelection";

import { CurriculumDownloadViewProps } from ".";

import { fetchHubspotContactDetails } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/fetchHubspotContactDetails";

export type CurriculumDownloadViewData = {
  schools: School[];
  schoolId?: string;
  schoolName?: string;
  email?: string;
  downloadType: DownloadType;
  termsAndConditions?: boolean;
  schoolNotListed?: boolean;
};

export type CurriculumDownloadViewErrors = Partial<{
  schoolId: string;
  email: string;
  termsAndConditions: string;
  schoolNotListed: string;
}>;

type SignedInFlowProps = CurriculumDownloadViewProps & {
  user: ReturnType<typeof useUser>;
  downloadTypes: DownloadType[];
  onChangeDownloadTypes: (newDownloadType: DownloadType[]) => void;
};
export default function SignedInFlow({
  onSubmit,
  schools,
  submitError,
  availableDownloadTypes,
  downloadTypes,
  onChangeDownloadTypes,
}: SignedInFlowProps) {
  const submitErrorId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDownload = async () => {
    try {
      setIsSubmitting(true);
      const hubspotContact = await fetchHubspotContactDetails();

      if (onSubmit && hubspotContact) {
        onSubmit({
          schools,
          schoolId:
            [hubspotContact.schoolId, hubspotContact.schoolName].join("-") ??
            undefined,
          schoolName: hubspotContact.schoolName ?? undefined,
          email: hubspotContact?.email,
          downloadTypes: downloadTypes,
          termsAndConditions: true,
          schoolNotListed: !hubspotContact.schoolId,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OakGrid $cg="spacing-16">
      <OakGridArea
        $colSpan={[12, 8, 3]}
        $colStart={[1, 3, 1]}
        $gap={"spacing-32"}
      >
        <OakBox>
          <CurriculumDownloadSelection
            downloadTypes={downloadTypes}
            onChange={onChangeDownloadTypes}
            availableDownloadTypes={availableDownloadTypes}
          />
          <OakBox $mt="spacing-24">
            <Terms />
          </OakBox>
        </OakBox>
        {submitError && (
          <OakBox id={submitErrorId}>
            <OakFieldError>
              <OakP>{submitError}</OakP>
            </OakFieldError>
          </OakBox>
        )}
        <OakPrimaryButton
          data-testid="download"
          isLoading={isSubmitting}
          disabled={downloadTypes.length < 1}
          aria-describedby={submitError ? submitErrorId : undefined}
          onClick={onDownload}
          iconName="download"
          isTrailingIcon={true}
        >
          Download
        </OakPrimaryButton>
      </OakGridArea>
    </OakGrid>
  );
}
