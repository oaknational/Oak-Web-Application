import {
  OakBox,
  OakFieldError,
  OakFlex,
  OakFlexProps,
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
import { CurriculumDownloadSelection } from "./CurriculumDownloadSelection";

import spacing, { SpacingProps } from "@/styles/utils/spacing";
import ResourcePageDetailsCompleted from "@/components/TeacherComponents/ResourcePageDetailsCompleted";

const StyledForm = styled(OakFlex)<OakFlexProps & SpacingProps>`
  ${spacing}
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
  availableDownloadTypes: DownloadType[];
  submitError?: string;
};
export default function SignedOutFlow({
  schools,
  data,
  onChange,
  onSubmit,
  isSubmitting,
  downloadTypes,
  onChangeDownloadTypes,
  availableDownloadTypes,
  submitError,
}: SignedOutFlowProps) {
  const errorMessageListId = useId();
  const submitErrorId = useId();
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
      (Boolean(data.schoolId?.length) ||
        data.schoolNotListed === true ||
        Boolean(data.email?.length)) &&
      data.termsAndConditions
    );
  });

  return (
    <OakFlex
      $gap={["space-between-m2", "space-between-l"]}
      $flexDirection={["column", "row"]}
    >
      <OakBox $width={["100%", "all-spacing-20"]} $textAlign={"left"}>
        <CurriculumDownloadSelection
          downloadTypes={downloadTypes}
          onChange={onChangeDownloadTypes}
          availableDownloadTypes={availableDownloadTypes}
        />
      </OakBox>

      <OakBox $maxWidth={["100%", "all-spacing-20"]} $textAlign={"left"}>
        <OakFlex $flexDirection={"column"} $gap={"space-between-m"}>
          <OakHeading tag="h3" $font={["heading-5"]}>
            Your details
          </OakHeading>
          <StyledForm
            as={"form"}
            onSubmit={onSubmitLocal}
            $alignItems={"center"}
          >
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
                {submitError && (
                  <OakBox id={submitErrorId}>
                    <OakFieldError>
                      <OakP>{submitError}</OakP>
                    </OakFieldError>
                  </OakBox>
                )}
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
                  aria-describedby={submitError ? submitErrorId : undefined}
                  iconName="download"
                  isTrailingIcon={true}
                >
                  Download
                </OakPrimaryButton>
              </OakFlex>
            </OakFlex>
          </StyledForm>
        </OakFlex>
      </OakBox>
    </OakFlex>
  );
}
