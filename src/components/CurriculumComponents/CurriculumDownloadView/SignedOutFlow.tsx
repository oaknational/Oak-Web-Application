import {
  OakFieldError,
  OakFlex,
  OakHeading,
  OakLI,
  OakP,
  OakPrimaryButton,
  OakUL,
} from "@oaknational/oak-components";
import { FormEvent, useId, useState } from "react";
import styled from "styled-components";

import AcceptTerms from "../OakComponentsKitchen/AcceptTerms";
import YourDetails from "../OakComponentsKitchen/YourDetails";
import Terms from "../OakComponentsKitchen/Terms";

import { submitSchema } from "./schema";
import { DownloadType, School, runSchema } from "./helper";
import { CurriculumResourcesSelector } from "./CurriculumResourcesSelector";

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

type SignedOutFlowProps = {
  isSubmitting: boolean;
  data: CurriculumDownloadViewData;
  schools: School[];
  onChange?: (value: CurriculumDownloadViewData) => void;
  onSubmit?: (value: CurriculumDownloadViewData) => void;
  downloadType: DownloadType;
  onChangeDownloadType: (newDownloadType: DownloadType) => void;
};
export default function SignedOutFlow({
  schools,
  data,
  onChange,
  onSubmit,
  isSubmitting,
  downloadType,
  onChangeDownloadType,
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
        onSubmit(data);
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
        <CurriculumResourcesSelector
          downloadType={downloadType}
          onChangeDownloadType={onChangeDownloadType}
        />
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
                  disabled={false}
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
