import { FC, useState, useEffect } from "react";
import { OakHeading, OakFlex } from "@oaknational/oak-components";

import { Unit } from "../CurriculumVisualiser";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import Box from "@/components/SharedComponents/Box";
import Button from "@/components/SharedComponents/Button";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import Card from "@/components/SharedComponents/Card";
import {
  CurriculumUnitDetailsProps,
  CurriculumUnitDetails,
} from "@/components/CurriculumComponents/CurriculumUnitDetails";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";

type UnitModalProps = {
  unitData: Unit | null;
  displayModal: boolean;
  setUnitOptionsAvailable: (x: boolean) => void;
  setCurrentUnitLessons: (x: Lesson[]) => void;
  setUnitVariantID: (x: number | null) => void;
  unitOptionsAvailable: boolean;
  isHighlighted: boolean;
};

export type Lesson = {
  title: string;
  slug?: string;
  _state?: string;
};

const UnitModal: FC<UnitModalProps> = ({
  unitData,
  displayModal,
  setUnitOptionsAvailable,
  setCurrentUnitLessons,
  setUnitVariantID,
  unitOptionsAvailable,
  isHighlighted,
}) => {
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const [optionalityModalOpen, setOptionalityModalOpen] =
    useState<boolean>(false);

  const [curriculumUnitDetails, setCurriculumUnitDetails] =
    useState<CurriculumUnitDetailsProps | null>(null);

  const handleOptionalityModal = () => {
    setOptionalityModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (displayModal === false) {
      setCurriculumUnitDetails(null);
      setOptionalityModalOpen(false);
      setUnitOptionsAvailable(false);
      setUnitVariantID(null);
    }

    if (optionalityModalOpen) {
      setUnitOptionsAvailable(false);
    }
  }, [
    displayModal,
    setUnitOptionsAvailable,
    optionalityModalOpen,
    setUnitVariantID,
  ]);

  useEffect(() => {
    // For tracking open model events
    if (displayModal === true) {
      if (unitData) {
        track.unitInformationViewed({
          unitName: unitData.title,
          unitSlug: unitData.slug,
          subjectTitle: unitData.subject,
          subjectSlug: unitData.subject_slug,
          yearGroupName: unitData.year,
          yearGroupSlug: unitData.year,
          unitHighlighted: isHighlighted,
          analyticsUseCase: analyticsUseCase,
          //update to include optionality units
        });
      }
    }
  });

  return (
    <>
      {unitData && (
        <OakFlex
          $flexDirection={"column"}
          $maxWidth={"100%"}
          $justifyContent={"space-between"}
          $width={"100%"}
          $overflowY={"scroll"}
          $mt="space-between-xxl"
        >
          <Box $ph={[24, 72]}>
            <Box $display={optionalityModalOpen ? "block" : "none"} $mb={16}>
              <Button
                $mt={2}
                icon="chevron-left"
                label="Back to unit options info"
                variant="minimal"
                $font={"heading-7"}
                iconBackground={undefined}
                background={undefined}
                onClick={() => {
                  handleOptionalityModal();
                  setUnitOptionsAvailable(true);
                  setCurriculumUnitDetails(null);
                  setUnitVariantID(null);
                }}
              />
            </Box>
            <LessonMetadata
              subjectTitle={unitData.subject}
              yearTitle={`Year ${unitData.year}`}
            />
            <OakHeading tag="h2" $font={"heading-5"}>
              {!curriculumUnitDetails
                ? unitData.title
                : curriculumUnitDetails.unitTitle}
            </OakHeading>
            {!unitOptionsAvailable && (
              <Box $display={optionalityModalOpen ? "none" : "block"}>
                <CurriculumUnitDetails
                  threads={unitData.threads}
                  lessons={unitData.lessons}
                  priorUnitDescription={
                    unitData.connection_prior_unit_description
                  }
                  futureUnitDescription={
                    unitData.connection_future_unit_description
                  }
                  priorUnitTitle={unitData.connection_prior_unit_title}
                  futureUnitTitle={unitData.connection_future_unit_title}
                />
              </Box>
            )}

            {/* @todo replace with OakFlex once display is fixed in OakFlex - currently display: flex overwrites "none" */}
            <Flex
              $flexDirection={"column"}
              $display={optionalityModalOpen ? "none" : "flex"}
            >
              {unitOptionsAvailable && (
                <Box
                  $position={"relative"}
                  $background={"pink30"}
                  $pa={24}
                  $mt={40}
                  data-testid="unit-options-card"
                  $borderRadius={4}
                >
                  <OakHeading
                    tag="h4"
                    $font={"heading-6"}
                    $mb="space-between-m"
                    data-testid="unit-options-heading"
                  >
                    Unit options
                  </OakHeading>
                  <OakFlex
                    $flexDirection={["column", "row"]}
                    $gap="all-spacing-6"
                    $flexWrap={"wrap"}
                  >
                    {unitData.unit_options.map((optionalUnit, index) => {
                      return (
                        <Card
                          $pa={16}
                          key={`${optionalUnit.unitvariant_id}-${index}}`}
                          $background={"white"}
                          $position={"relative"}
                          $maxWidth={["100%", "calc(50% - 12px)"]}
                          $minWidth={["100%", "calc(50% - 12px)"]}
                          data-testid="unit-option"
                          $maxHeight={"fit-content"}
                          $justifyContent={"space-between"}
                        >
                          <Box>
                            <BrushBorders color="white" />
                            <OakHeading
                              tag="h5"
                              $font={"heading-7"}
                              $mb="space-between-s"
                              $wordWrap={"normal"}
                            >
                              {optionalUnit.title}
                            </OakHeading>
                          </Box>

                          <OakFlex
                            $flexDirection={"row"}
                            $justifyContent={"flex-end"}
                            $alignSelf={"flex-end"}
                          >
                            <OakFlex
                              $flexDirection={"row"}
                              $alignItems={"flex-start"}
                              $width={"100%"}
                              $color={"grey70"}
                            >
                              <Button
                                label="Unit info"
                                data-testid="unit-info-button"
                                $font={"heading-7"}
                                icon="chevron-right"
                                $iconPosition="trailing"
                                variant="minimal"
                                iconBackground={undefined}
                                background={undefined}
                                onClick={() => {
                                  handleOptionalityModal();
                                  setUnitOptionsAvailable(false);
                                  setUnitVariantID(optionalUnit.unitvariant_id);
                                  setCurrentUnitLessons(optionalUnit.lessons);
                                  setCurriculumUnitDetails({
                                    unitTitle: optionalUnit.title,
                                    threads: unitData.threads,
                                    lessons: optionalUnit.lessons,
                                    priorUnitDescription:
                                      optionalUnit.connection_prior_unit_description,
                                    futureUnitDescription:
                                      optionalUnit.connection_future_unit_description,
                                    priorUnitTitle:
                                      optionalUnit.connection_prior_unit_title,
                                    futureUnitTitle:
                                      optionalUnit.connection_future_unit_title,
                                  });
                                }}
                              />
                            </OakFlex>
                          </OakFlex>
                        </Card>
                      );
                    })}
                  </OakFlex>
                </Box>
              )}
            </Flex>

            {curriculumUnitDetails && (
              <Box $display={optionalityModalOpen ? "block" : "none"}>
                <CurriculumUnitDetails {...curriculumUnitDetails} />
              </Box>
            )}
          </Box>
        </OakFlex>
      )}
    </>
  );
};
export default UnitModal;
