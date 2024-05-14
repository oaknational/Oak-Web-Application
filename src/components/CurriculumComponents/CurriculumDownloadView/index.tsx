import {
  OakBox,
  OakFieldError,
  OakFlex,
  OakHeading,
  OakLI,
  OakP,
  OakRadioButton,
  OakRadioGroup,
  OakUL,
} from "@oaknational/oak-components";
import { FC, FormEvent, useState } from "react";
import styled from "styled-components";

import CurriculumDocumentPreview from "../CurriculumDocumentPreview";
import AcceptTerms from "../OakComponentsKitchen/AcceptTerms";
import YourDetails from "../OakComponentsKitchen/YourDetails";

import { submitSchema } from "./schema";
import { School, runSchema } from "./helper";

import Box from "@/components/SharedComponents/Box";
import flex, { FlexCssProps } from "@/styles/utils/flex";
import spacing, { SpacingProps } from "@/styles/utils/spacing";
import LoadingButton from "@/components/SharedComponents/Button/LoadingButton";
import ResourcePageDetailsCompleted from "@/components/TeacherComponents/ResourcePageDetailsCompleted";

const StyledForm = styled.form<FlexCssProps & SpacingProps>`
  ${flex}
  ${spacing}
  display: flex;
`;

const Container = styled(OakFlex)`
  flex-direction: row;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const validDownloadTypes = ["word", "pdf"] as const;
export type DownloadType = (typeof validDownloadTypes)[number];

const assertValidDownloadType = (val: string) => {
  if (!validDownloadTypes.includes(val as DownloadType)) {
    throw new Error("Invalid ");
  }
  return val as DownloadType;
};

const DOWNLOAD_LABELS: [DownloadType, string][] = [
  ["word", "Word"],
  ["pdf", "PDF"],
];

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

export type CurriculumDownloadViewProps = {
  isSubmitting: boolean;
  data: CurriculumDownloadViewData;
  schools: School[];
  onChange?: (value: CurriculumDownloadViewData) => void;
  onSubmit?: (value: CurriculumDownloadViewData) => void;
};
const CurriculumDownloadView: FC<CurriculumDownloadViewProps> = ({
  schools,
  data,
  onChange,
  onSubmit,
  isSubmitting,
}) => {
  const [errors, setErrors] = useState<CurriculumDownloadViewErrors>(
    () => ({}),
  );
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
    <OakBox $color="black">
      <OakHeading tag="h2" $font={["heading-4"]} $mb={["space-between-m"]}>
        Download
      </OakHeading>
      <Container $gap={["space-between-m2", "space-between-l"]}>
        <Box $width={["100%", 510]} $textAlign={"left"}>
          <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
            <OakHeading
              tag="h3"
              $font={["heading-5"]}
              data-testid="download-heading"
            >
              Document preview
            </OakHeading>
            <CurriculumDocumentPreview />
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

                <Box>
                  <OakFlex
                    $flexDirection={"column"}
                    $width={"100%"}
                    $gap={"space-between-s"}
                    $mv={"space-between-m2"}
                  >
                    <OakHeading tag={"h3"} $font={"heading-7"}>
                      Download options
                    </OakHeading>
                    <OakRadioGroup
                      aria-label="Download type"
                      name="download-type"
                      data-testid="download-download-type"
                      value={data.downloadType}
                      onChange={(e) =>
                        onChangeLocal({
                          downloadType: assertValidDownloadType(e.target.value),
                        })
                      }
                      $gap={"space-between-s"}
                      $flexDirection={"column"}
                    >
                      {DOWNLOAD_LABELS.map(
                        ([downloadTypeValue, downloadTypeLabel]) => {
                          return (
                            <OakRadioButton
                              id={downloadTypeValue}
                              key={downloadTypeValue}
                              label={downloadTypeLabel}
                              value={downloadTypeValue}
                              data-testid={downloadTypeValue}
                            />
                          );
                        },
                      )}
                    </OakRadioGroup>
                  </OakFlex>
                </Box>

                <OakFlex $flexDirection={"column"} $gap={"space-between-m"}>
                  {hasErrors > 0 && (
                    <OakFieldError>
                      <OakP>To download fix following errors:</OakP>
                      <OakUL>
                        {Object.entries(errors).map(([key, value]) => {
                          return <OakLI key={key}>{value}</OakLI>;
                        })}
                      </OakUL>
                    </OakFieldError>
                  )}
                  <LoadingButton
                    text="Download"
                    isLoading={isSubmitting}
                    loadingText="Download"
                    type="submit"
                    icon="download"
                    disabled={false}
                  />
                </OakFlex>
              </OakFlex>
            </StyledForm>
          </OakFlex>
        </Box>
      </Container>
    </OakBox>
  );
};

export default CurriculumDownloadView;
