import {
  OakBox,
  OakCheckBox,
  OakFieldError,
  OakFlex,
  OakHeading,
  OakLI,
  OakLink,
  OakP,
  OakRadioButton,
  OakRadioGroup,
  OakUL,
} from "@oaknational/oak-components";
import { ComponentProps, FC, FormEvent, useMemo, useState } from "react";
import styled from "styled-components";

import CurriculumDocumentPreview from "../CurriculumDocumentPreview";
import Autocomplete, {
  AutocompleteItem,
} from "../OakComponentsKitchen/Autocomplete";

import { submitSchema } from "./schema";
import { School, parseSchoolToListItems, runSchema } from "./helper";

import { resolveOakHref } from "@/common-lib/urls";
import Box from "@/components/SharedComponents/Box";
import Input from "@/components/SharedComponents/Input";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import flex, { FlexCssProps } from "@/styles/utils/flex";
import spacing, { SpacingProps } from "@/styles/utils/spacing";
import { HOMESCHOOL_URN } from "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker";
import LoadingButton from "@/components/SharedComponents/Button/LoadingButton";
import { formatSchoolName } from "@/components/TeacherComponents/ResourcePageSchoolPicker/formatSchoolName";

const useSchoolsFromApi = ({
  schools,
}: {
  schools: School[];
}): {
  key: string;
  textValue: string;
}[] => {
  return useMemo(() => {
    return [
      ...parseSchoolToListItems(schools),
      { textValue: "Homeschool", key: HOMESCHOOL_URN },
    ];
  }, [schools]);
};

const Link = (props: ComponentProps<typeof OakLink>) => {
  const isExternal = props.rel === "external";
  const additionalProps = isExternal
    ? ({
        target: "_blank",
      } as const)
    : {};
  return (
    <OakLink {...props} {...additionalProps} style={{ display: "inline" }}>
      {props.children}
    </OakLink>
  );
};

const StyledForm = styled.form<FlexCssProps & SpacingProps>`
  ${flex}
  ${spacing}
  display: flex;
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

const injectCurrentSchool = (
  data: { schoolId?: string; schoolName?: string },
  schools: { key: string; textValue: string }[],
) => {
  const found = !!schools.find((school) => {
    return school.key === data.schoolId;
  });

  if (!found && data.schoolId && data.schoolName) {
    return [
      ...schools,
      {
        key: data.schoolId,
        textValue: data.schoolName,
      },
    ];
  }
  return schools;
};

export type CurriculumDownloadViewData = {
  schools: School[];
  loadingSchools: boolean;
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
  const schoolsAsAutocompleteItems = useSchoolsFromApi({ schools });
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

  const autoCompleteList = injectCurrentSchool(
    data,
    schoolsAsAutocompleteItems,
  );

  return (
    <OakBox $color="black">
      <OakHeading tag="h2" $font={["heading-4"]} $mb={["space-between-m"]}>
        Download
      </OakHeading>
      <OakFlex
        $gap={["space-between-m2", "space-between-l"]}
        $flexDirection={["column", "column", "row"]}
      >
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
            <StyledForm
              role="search"
              onSubmit={onSubmitLocal}
              $alignItems={"center"}
            >
              <fieldset
                disabled={isSubmitting}
                style={{ border: "none", padding: 0, margin: 0 }}
              >
                <OakFlex
                  $width={"100%"}
                  $flexDirection={"column"}
                  $alignItems={"start"}
                  $gap={["space-between-l"]}
                >
                  <OakFlex
                    $width={"100%"}
                    $flexDirection={"column"}
                    $alignItems={"start"}
                    $gap={"space-between-xs"}
                  >
                    <Autocomplete
                      key={data.schoolId}
                      inputProps={{
                        label: "School (required)",
                        id: "download-school",
                        error: errors.schoolId,
                        placeholder:
                          "Type school name, postcode, or ‘homeschool’",
                      }}
                      onChange={(value, textValue) => {
                        onChangeLocal({
                          schoolId: value,
                          schoolName: textValue,
                          schoolNotListed: false,
                        });
                      }}
                      onInputChange={(value) => {
                        onChangeLocal({
                          schoolName: value,
                          schoolId: undefined,
                        });
                      }}
                      value={data.schoolName}
                    >
                      {autoCompleteList.map(({ key, textValue }) => {
                        const element = formatSchoolName(
                          textValue,
                          data.schoolName,
                        );
                        return (
                          <AutocompleteItem key={key} textValue={textValue}>
                            {element}
                          </AutocompleteItem>
                        );
                      })}
                    </Autocomplete>
                    <OakCheckBox
                      displayValue={"My school isn't listed"}
                      checked={data.schoolNotListed}
                      onChange={(e) =>
                        onChangeLocal({
                          schoolNotListed: e.target.checked,
                          schoolId: undefined,
                        })
                      }
                      value="download-school-isnt-listed"
                      id="download-school-isnt-listed"
                      data-testid="download-school-isnt-listed"
                      name={"school-isnt-listed"}
                    />
                  </OakFlex>

                  <OakFlex
                    $width={"100%"}
                    $flexDirection={"column"}
                    $alignItems={"start"}
                    $gap={"space-between-xs"}
                  >
                    <Input
                      $mb={0}
                      label="Email (optional)"
                      id="download-email"
                      data-testid="download-email"
                      value={data.email}
                      type="text"
                      error={errors.email}
                      onBlur={(e) => onChangeLocal({ email: e.target.value })}
                      onChange={(e) => onChangeLocal({ email: e.target.value })}
                    />

                    <OakP $font={["body-3"]}>
                      Join over 100k teachers and get free resources and other
                      helpful content by email. Unsubscribe at any time. Read
                      our{" "}
                      <Link
                        href={resolveOakHref({
                          page: "legal",
                          legalSlug: "privacy",
                        })}
                      >
                        privacy policy
                      </Link>
                      .
                    </OakP>
                  </OakFlex>

                  <OakFlex
                    $width={"100%"}
                    $flexDirection={"column"}
                    $alignItems={"start"}
                    $gap={"space-between-m"}
                  >
                    {errors.termsAndConditions && (
                      <OakFieldError>{errors.termsAndConditions}</OakFieldError>
                    )}
                    <Box
                      $position={"relative"}
                      $background={"grey20"}
                      $pv={6}
                      $ph={6}
                    >
                      <BrushBorders
                        hideOnMobileH
                        hideOnMobileV
                        color={"grey20"}
                      />
                      <OakCheckBox
                        displayValue={
                          "I accept terms and conditions (required)"
                        }
                        checked={data.termsAndConditions}
                        onChange={(e) =>
                          onChangeLocal({
                            termsAndConditions: e.target.checked,
                          })
                        }
                        value="download-accept-terms"
                        id="download-accept-terms"
                        data-testid="download-accept-terms"
                        name={"accept-terms"}
                      />
                    </Box>

                    <OakP $font={["body-3"]}>
                      This content is © Oak National Academy (2023), licensed
                      on{" "}
                      <Link
                        target="_blank"
                        rel="external"
                        href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                      >
                        Open Government Licence version 3.0
                      </Link>{" "}
                      except where otherwise stated. See{" "}
                      <Link
                        rel="external"
                        href={resolveOakHref({
                          page: "legal",
                          legalSlug: "terms-and-conditions",
                        })}
                      >
                        Oak's terms and conditions
                      </Link>
                      .
                    </OakP>
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
                              downloadType: assertValidDownloadType(
                                e.target.value,
                              ),
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
              </fieldset>
            </StyledForm>
          </OakFlex>
        </Box>
      </OakFlex>
    </OakBox>
  );
};

export default CurriculumDownloadView;
