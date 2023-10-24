import { FC, useState, useEffect } from "react";

import Flex from "@/components/Flex";
import Box from "@/components/Box";
import { Heading } from "@/components/Typography";
import Button from "@/components/Button";
import { Unit } from "@/components/pages/CurriculumInfo/tabs/UnitsTab/UnitsTab";
import LessonMetadata from "@/components/LessonMetadata";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders";
import Card from "@/components/Card";
import {
  CurriculumUnitDetailsProps,
  CurriculumUnitDetails,
} from "@/components/CurriculumUnitDetails";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";

type UnitModalProps = {
  unitData: Unit | null;
  displayModal: boolean;
  setUnitOptionsAvailable: (x: boolean) => void;
  unitOptionsAvailable: boolean;
  isHighlighted: boolean;
};

export type Lesson = {
  title: string;
  slug?: string;
};

const UnitModal: FC<UnitModalProps> = ({
  unitData,
  displayModal,
  setUnitOptionsAvailable,
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
    }

    if (optionalityModalOpen) {
      setUnitOptionsAvailable(false);
    }
  }, [displayModal, setUnitOptionsAvailable, optionalityModalOpen]);

  useEffect(() => {
    // For tracking open model events
    if (displayModal === true) {
      if (unitData) {
        track.unitInformationViewed({
          unitName: unitData.title /* string */,
          unitSlug: unitData.slug /* string */,
          subjectTitle: unitData.subject /* string */,
          subjectSlug: unitData.subject_slug /* string */,
          yearGroupName: unitData.year /* string */,
          yearGroupSlug: unitData.year /* string */,
          unitHighlighted: isHighlighted /* bool */,
          analyticsUseCase:
            analyticsUseCase /* (restricted to : "Pupil", "Teacher") */,
        });
      }
    }
  });

  return (
    <>
      {unitData && (
        <Flex
          $flexDirection={"column"}
          $maxWidth={"100%"}
          $justifyContent={"space-between"}
          $width={"100%"}
          $overflowY={"scroll"}
          $mt={72}
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
                }}
              />
            </Box>
            <LessonMetadata
              subjectTitle={unitData.subject}
              yearTitle={`Year ${unitData.year}`}
            />
            <Heading tag="h2" $font={"heading-5"}>
              {!curriculumUnitDetails
                ? unitData.title
                : curriculumUnitDetails.unitTitle}
            </Heading>
            {!unitOptionsAvailable && (
              <Box $display={optionalityModalOpen ? "none" : "block"}>
                <CurriculumUnitDetails
                  threads={unitData.threads}
                  lessons={unitData.lessons}
                />
              </Box>
            )}

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
                  <Heading
                    tag="h4"
                    $font={"heading-6"}
                    $mb={24}
                    data-testid="unit-options-heading"
                  >
                    Unit options
                  </Heading>
                  <Flex
                    $flexDirection={["column", "row"]}
                    $gap={24}
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
                            <Heading
                              tag="h5"
                              $font={"heading-7"}
                              $mb={16}
                              $wordWrap={"normal"}
                            >
                              {optionalUnit.title}
                            </Heading>
                          </Box>

                          <Flex
                            $flexDirection={"row"}
                            $justifyContent={"flex-end"}
                            $alignSelf={"flex-end"}
                          >
                            <Flex
                              $flexDirection={"row"}
                              $alignItems={"flex-start"}
                              $width={"100%"}
                              $color={"oakGrey5"}
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
                                  setCurriculumUnitDetails({
                                    unitTitle: optionalUnit.title,
                                    threads: unitData.threads,
                                    lessons: optionalUnit.lessons,
                                  });
                                }}
                              />
                            </Flex>
                          </Flex>
                        </Card>
                      );
                    })}
                  </Flex>
                </Box>
              )}
            </Flex>

            {curriculumUnitDetails && (
              <Box $display={optionalityModalOpen ? "block" : "none"}>
                <CurriculumUnitDetails {...curriculumUnitDetails} />
              </Box>
            )}
          </Box>
        </Flex>
      )}
    </>
  );
};
export default UnitModal;
