import { OakFlex, OakPrimaryButton } from "@oaknational/oak-components";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

import { DOWNLOAD_TYPES, DownloadType, School } from "./helper";
import { CurriculumResourcesSelector } from "./CurriculumResourcesSelector";

import { CurriculumDownloadViewProps } from ".";

import Box from "@/components/SharedComponents/Box";
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
};
export default function SignedInFlow({ onSubmit, schools }: SignedInFlowProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadType, setDownloadType] = useState(DOWNLOAD_TYPES[0]!.id);

  const onDownload = async () => {
    try {
      setIsSubmitting(true);
      const hubspotContact = await fetchHubspotContactDetails();

      if (onSubmit && hubspotContact) {
        onSubmit({
          schools,
          schoolId: hubspotContact.schoolId ?? undefined,
          schoolName: hubspotContact.schoolName ?? undefined,
          email: hubspotContact?.email,
          downloadType: downloadType,
          termsAndConditions: true,
          schoolNotListed: !hubspotContact.schoolId,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OakFlex
      $gap={["space-between-m2", "space-between-l"]}
      $flexDirection="column"
      $alignItems={"flex-start"}
    >
      <Box $width={["100%", 510]} $textAlign={"left"}>
        <CurriculumResourcesSelector
          downloadType={downloadType}
          onChangeDownloadType={setDownloadType}
        />
      </Box>
      <OakPrimaryButton isLoading={isSubmitting} onClick={onDownload}>
        Download
      </OakPrimaryButton>
    </OakFlex>
  );
}
