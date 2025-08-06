import {
  OakBox,
  OakFlex,
  OakPrimaryButton,
  OakDownloadCard,
  OakHeading,
  OakTagFunctional,
} from "@oaknational/oak-components";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { uniq } from "lodash";

import Terms from "../OakComponentsKitchen/Terms";

import {
  DOWNLOAD_TYPES,
  DownloadType,
  School,
  assertValidDownloadType,
} from "./helper";

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
  const [downloadTypes, setDownloadTypes] = useState(() =>
    DOWNLOAD_TYPES.map(({ id }) => id),
  );

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
      $gap={["space-between-m2", "space-between-l"]}
      $flexDirection="column"
      $alignItems={"flex-start"}
    >
      <Box $width={["100%", 510]} $textAlign={"left"}>
        <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
          <OakHeading
            tag="h3"
            $font={["heading-5"]}
            data-testid="download-heading"
          >
            Curriculum resources
          </OakHeading>
          <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
            {DOWNLOAD_TYPES.map((download) => {
              const isChecked = downloadTypes.includes(download.id);
              const isEditable = download.subTitle?.includes("accessible");

              return (
                <OakDownloadCard
                  key={download.id}
                  id={download.id}
                  data-testid="resourceCard"
                  value={download.id}
                  name="curriculum-download"
                  titleSlot={download.label}
                  checked={isChecked}
                  onChange={(e) => {
                    const downloadType = assertValidDownloadType(
                      e.target.value,
                    );
                    let newDownloadTypes: DownloadType[];
                    if (e.target.checked) {
                      newDownloadTypes = uniq([...downloadTypes, downloadType]);
                    } else {
                      newDownloadTypes = downloadTypes.filter(
                        (id) => id !== downloadType,
                      );
                    }
                    setDownloadTypes(newDownloadTypes);
                  }}
                  formatSlot={
                    <>
                      {download.subTitle}
                      {isEditable && (
                        <OakTagFunctional
                          key="tag"
                          $ml={"space-between-ssx"}
                          $display="inline"
                          $color={"text-primary"}
                          $font={"heading-light-7"}
                          $ph={"inner-padding-ssx"}
                          $pv={"inner-padding-ssx"}
                          label="Editable"
                          $background={"bg-decorative2-main"}
                        />
                      )}
                    </>
                  }
                  iconName={download.icon}
                />
              );
            })}
          </OakFlex>
        </OakFlex>
        <OakBox $mt="space-between-m">
          <Terms />
        </OakBox>
      </Box>
      <OakPrimaryButton
        data-testid="download"
        isLoading={isSubmitting}
        disabled={downloadTypes.length < 1}
        onClick={onDownload}
        iconName="download"
        isTrailingIcon={true}
      >
        Download
      </OakPrimaryButton>
    </OakFlex>
  );
}
