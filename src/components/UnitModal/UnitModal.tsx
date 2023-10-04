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

/**
 * ? TODO:
 * ! custom hook to render button on menu
 * ! focus svg line
 * ! Accordians staying open
 */

type UnitModalProps = {
  unitData: Unit | null;
  displayModal: boolean;
  setUnitOptionsAvailable: (x: boolean) => void;
  unitOptionsAvailable: boolean;
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
}) => {
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
  }, [
    displayModal,
    curriculumUnitDetails,
    setUnitOptionsAvailable,
    optionalityModalOpen,
    unitData,
  ]);

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
                label="Back to unit options info"
                $font={"heading-7"}
                icon="chevron-left"
                iconBackground="white"
                variant="minimal"
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
                  toggleClosed={displayModal}
                  threads={unitData.threads}
                  lessons={unitData.lessons}
                  numberOfLessons={unitData.planned_number_of_lessons}
                  previousUnitDescription={
                    unitData.connection_prior_unit_description
                  }
                  futureUnitDescription={
                    unitData.connection_future_unit_description
                  }
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
                  $pa={12}
                  $mt={40}
                  data-testid="unit-options-card"
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
                      const optionalUnitLessonCount =
                        optionalUnit.lessons.length;
                      return (
                        <Card
                          $pa={16}
                          key={`${optionalUnit.unitvariant_id}-${index}}`}
                          $background={"white"}
                          $position={"relative"}
                          $width={["100%", "calc(50% - 28px)"]}
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
                                $font={"heading-7"}
                                icon="chevron-right"
                                iconBackground="white"
                                $iconPosition="trailing"
                                variant="minimal"
                                onClick={() => {
                                  handleOptionalityModal();
                                  setUnitOptionsAvailable(false);
                                  setCurriculumUnitDetails({
                                    unitTitle: optionalUnit.title,
                                    threads: unitData.threads,
                                    lessons: optionalUnit.lessons,
                                    numberOfLessons: optionalUnitLessonCount,
                                    previousUnitDescription:
                                      optionalUnit.connection_prior_unit_description,
                                    futureUnitDescription:
                                      optionalUnit.connection_future_unit_description,
                                  });
                                }}
                              />
                            </Flex>
                          </Flex>
                        </Card>
                      );
                    })}
                  </Flex>

                  <BrushBorders color="pink30" />
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
