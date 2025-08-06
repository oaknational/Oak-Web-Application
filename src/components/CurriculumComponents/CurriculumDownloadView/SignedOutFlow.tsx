import {
  OakFieldError,
  OakFlex,
  OakHeading,
  OakLI,
  OakP,
  OakPrimaryButton,
  OakUL,
  OakDownloadCard,
  OakTagFunctional,
} from "@oaknational/oak-components";
import { FormEvent, useId, useState } from "react";
import styled from "styled-components";
import { uniq } from "lodash";

import AcceptTerms from "../OakComponentsKitchen/AcceptTerms";
import YourDetails from "../OakComponentsKitchen/YourDetails";
import Terms from "../OakComponentsKitchen/Terms";

import { submitSchema } from "./schema";
import {
  DownloadType,
  DOWNLOAD_TYPES,
  School,
  runSchema,
  assertValidDownloadType,
} from "./helper";

import Box from "@/components/SharedComponents/Box";
import flex, { FlexCssProps } from "@/styles/utils/flex";
import spacing, { SpacingProps } from "@/styles/utils/spacing";
import ResourcePageDetailsCompleted from "@/components/TeacherComponents/ResourcePageDetailsCompleted";

const StyledForm = styled.form<FlexCssProps & SpacingProps>`
  ${flex}
  ${spacing}
    display: flex;
`;

export type CurriculumDownloadViewData = {
  schools: School[];
  schoolId?: string;
  schoolName?: string;
  email?: string;
  downloadTypes: DownloadType[];
  termsAndConditions?: boolean;
  schoolNotListed?: boolean;
};

export type CurriculumDownloadViewErrors = Partial<{
  schoolId: string;
  email: string;
  termsAndConditions: string;
  schoolNotListed: string;
}>;

type SignedOutFlowProps = {
  isSubmitting: boolean;
  data: CurriculumDownloadViewData;
  schools: School[];
  onChange?: (value: CurriculumDownloadViewData) => void;
  onSubmit?: (value: CurriculumDownloadViewData) => void;
  downloadTypes: DownloadType[];
  onChangeDownloadTypes: (newDownloadType: DownloadType[]) => void;
};
export default function SignedOutFlow({
  schools,
  data,
  onChange,
  onSubmit,
  isSubmitting,
  downloadTypes,
  onChangeDownloadTypes,
}: SignedOutFlowProps) {
  const errorMessageListId = useId();
  const [errors, setErrors] = useState<CurriculumDownloadViewErrors>({});
  const hasErrors = Object.keys(errors).length;

  const onChangeLocal = (partial: Partial<CurriculumDownloadViewData>) => {
    const newData = {
      ...data,
      ...partial,
    };
    onChange?.(newData);
  };

  const onSubmitLocal = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      const newSubmitValidatioResults = runSchema(submitSchema, data);
      setErrors(newSubmitValidatioResults.errors);
      if (newSubmitValidatioResults.success) {
        onSubmit({
          ...data,
          downloadTypes,
        });
      }
    }
  };

  const [isComplete, setIsComplete] = useState(() => {
    return (
      (Boolean(data.schoolId?.length) || Boolean(data.email?.length)) &&
      data.termsAndConditions
    );
  });

  return (
    <OakFlex
      $gap={["space-between-m2", "space-between-l"]}
      $flexDirection={["column", "row"]}
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
                    onChangeDownloadTypes(newDownloadTypes);
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
      </Box>

      <Box $maxWidth={["100%", 400]} $textAlign={"left"}>
        <OakFlex $flexDirection={"column"} $gap={"space-between-m"}>
          <OakHeading tag="h3" $font={["heading-5"]}>
            Your details
          </OakHeading>
          <StyledForm onSubmit={onSubmitLocal} $alignItems={"center"}>
            <OakFlex $flexDirection={"column"}>
              {!isComplete && (
                <OakFlex
                  $width={"100%"}
                  $flexDirection={"column"}
                  $alignItems={"start"}
                  $gap={["space-between-l"]}
                >
                  <YourDetails
                    schools={schools}
                    data={data}
                    errors={errors}
                    onChange={onChangeLocal}
                  />

                  <AcceptTerms
                    value={!!data.termsAndConditions}
                    error={errors.termsAndConditions}
                    onChange={(v) =>
                      onChangeLocal({
                        termsAndConditions: v,
                      })
                    }
                  />
                </OakFlex>
              )}

              {isComplete && (
                <ResourcePageDetailsCompleted
                  school={
                    data.schoolNotListed
                      ? "My school isn’t listed"
                      : data.schoolName
                  }
                  email={data.email}
                  onEditClick={() => setIsComplete(false)}
                />
              )}

              <OakFlex $flexDirection={"column"} $mt={"space-between-m"}>
                <Terms />
              </OakFlex>

              <OakFlex
                $flexDirection={"column"}
                $gap={"space-between-m"}
                $mv={"space-between-s"}
              >
                {hasErrors > 0 && (
                  <div id={errorMessageListId}>
                    <OakFieldError>
                      <OakP>To download fix following errors:</OakP>
                      <OakUL>
                        {Object.entries(errors).map(([key, value]) => {
                          return <OakLI key={key}>{value}</OakLI>;
                        })}
                      </OakUL>
                    </OakFieldError>
                  </div>
                )}
                <OakPrimaryButton
                  aria-errormessage={errorMessageListId}
                  isLoading={isSubmitting}
                  type="submit"
                  disabled={downloadTypes.length < 1}
                  iconName="download"
                  isTrailingIcon={true}
                >
                  Download
                </OakPrimaryButton>
              </OakFlex>
            </OakFlex>
          </StyledForm>
        </OakFlex>
      </Box>
    </OakFlex>
  );
}
