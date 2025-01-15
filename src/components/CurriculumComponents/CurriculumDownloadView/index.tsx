import {
  OakBox,
  OakFieldError,
  OakFlex,
  OakHeading,
  OakLI,
  OakP,
  OakPrimaryButton,
  OakUL,
} from "@oaknational/oak-components";
import { FC, FormEvent, useId, useState } from "react";
import styled from "styled-components";

import AcceptTerms from "../OakComponentsKitchen/AcceptTerms";
import YourDetails from "../OakComponentsKitchen/YourDetails";
import Terms from "../OakComponentsKitchen/Terms";

import { submitSchema } from "./schema";
import {
  School,
  assertValidDownloadType,
  runSchema,
  validDownloadTypes,
} from "./helper";

import Box from "@/components/SharedComponents/Box";
import flex, { FlexCssProps } from "@/styles/utils/flex";
import spacing, { SpacingProps } from "@/styles/utils/spacing";
import ResourcePageDetailsCompleted from "@/components/TeacherComponents/ResourcePageDetailsCompleted";
import Button from "@/components/SharedComponents/Button";
import ResourceCard from "@/components/TeacherComponents/ResourceCard";
import RadioGroup from "@/components/SharedComponents/RadioButtons/RadioGroup";

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

export type DownloadType = (typeof validDownloadTypes)[number];

const DOWNLOAD_TYPES: {
  id: DownloadType;
  label: string;
  disabled?: boolean;
  icon: string;
  subTitle?: string;
}[] = [
  {
    id: "word",
    label: "Curriculum plan",
    subTitle: "Word (accessible)",
    icon: "maths",
  },
  // {
  //   id: "pdf",
  //   label: "Curriculum plan",
  //   subTitle: "PDF",
  //   icon: "maths"
  // },
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
  onBackToKs4Options?: () => void;
};
const CurriculumDownloadView: FC<CurriculumDownloadViewProps> = ({
  schools,
  data,
  onChange,
  onSubmit,
  isSubmitting,
  onBackToKs4Options,
}) => {
  const [downloadType, setDownloadType] = useState(DOWNLOAD_TYPES[0]!.id);
  const errorMessageListId = useId();
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
      {onBackToKs4Options && (
        <OakBox $mb="space-between-m">
          <Button
            variant={"buttonStyledAsLink"}
            icon="chevron-left"
            data-testid="back-to-downloads-link"
            size="small"
            label="Back to KS4 options"
            onClick={onBackToKs4Options}
          />
        </OakBox>
      )}
      <Container $gap={["space-between-m2", "space-between-l"]}>
        <Box $width={["100%", 510]} $textAlign={"left"}>
          <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
            <OakHeading
              tag="h3"
              $font={["heading-5"]}
              data-testid="download-heading"
            >
              Curriculum resources
            </OakHeading>
            <RadioGroup
              aria-label="Subject Download Options"
              value={downloadType}
              onChange={(val) => {
                const newDownloadType = assertValidDownloadType(val);
                setDownloadType(newDownloadType);
              }}
            >
              <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
                {DOWNLOAD_TYPES.map((download) => {
                  return (
                    <ResourceCard
                      id={download.id}
                      key={download.label}
                      name={download.label}
                      label={download.label}
                      subtitle={download.subTitle ?? ""}
                      resourceType="curriculum-pdf"
                      onChange={() => {}}
                      checked={false}
                      onBlur={() => {}}
                      useRadio={true}
                      subjectIcon={download.icon}
                    />
                  );
                })}
              </OakFlex>
            </RadioGroup>
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
                    disabled={false}
                  >
                    Download
                  </OakPrimaryButton>
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
