import {
  OakBox,
  OakFlex,
  OakPrimaryButton,
  OakFieldError,
  OakP,
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
    <OakFlex
      $gap={["spacing-32", "spacing-48"]}
      $flexDirection="column"
      $alignItems={"flex-start"}
    >
      <OakBox $width={["100%", "spacing-360"]} $textAlign={"left"}>
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
        <OakBox id={submitErrorId} $width={"spacing-360"}>
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
    </OakFlex>
  );
}
