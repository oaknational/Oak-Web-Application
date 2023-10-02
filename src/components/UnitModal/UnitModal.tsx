import React, { FC, useState, useEffect } from "react";

import Flex from "@/components/Flex";
import Box from "@/components/Box";
import { Heading } from "@/components/Typography";
import Button from "@/components/Button";
import { Unit } from "@/components/pages/CurriculumInfo/tabs/UnitsTab/UnitsTab";
import LessonMetadata from "@/components/LessonMetadata";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders";
import Card from "@/components/Card";
import CurriculumUnitDetails, {
  CurriculumUnitDetailsProps,
} from "@/components/CurriculumUnitDetails/CurriculumUnitDetails";

type UnitModalProps = {
  unitData: Unit | null;
  displayModal: boolean;
  unitOptionsAvailable?: boolean;
  // setUnitOptionsAvailable: React.Dispatch<React.SetStateAction<boolean>>;
};

export type Lesson = {
  title: string;
  slug: string;
  order: number;
};

const UnitModal: FC<UnitModalProps> = ({
  unitData,
  displayModal,
  // unitOptionsAvailable,
  // setUnitOptionsAvailable,
}) => {
  let unitOptionsAvailable = false;

  if (unitData) {
    unitOptionsAvailable = unitData?.unit_options.length > 0 ? true : false;
  }

  const [optionalityModalOpen, setOptionalityModalOpen] =
    useState<boolean>(false);

  const [curriculumUnitDetails, setCurriculumUnitDetails] =
    useState<CurriculumUnitDetailsProps | null>(null);

  const handleOpenModal = () => {
    setOptionalityModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (displayModal === false) {
      setCurriculumUnitDetails(null);
      setOptionalityModalOpen(false);
    }
    // if (unitData) {
    //   unitData.unit_options.length > 0 ? setUnitOptionsAvailable(true) : null;
    // }
  }, [displayModal, unitData]);
  /**
   * TODO: UnitModal
   * ! Change color to OakGrey5 TagFunctional?????
   * ? New colors on OWA
   * ? Rename slugs so they are more specific
   */

  /**
   * TODO LIST FOR UNIT MODAL V 1.0
   * ! 1. Create accordian component
   * ! 2. Create sub unit modal - Lesson details components ✅
   * ! 3. Render the Lesson details component if no unit options available ✅
   * ! 4. Render the unit options component if unit options are available ✅
   * ! 5. When click on Unit info button render the sub unit modal and lesson buttons| ✅
   * ! 6. When pressing back button go back to the unit modal ✅
   */

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
                  handleOpenModal();
                  setCurriculumUnitDetails(null);
                }}
              />
            </Box>
            <LessonMetadata
              subjectTitle={unitData.subject}
              year={unitData.year}
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
                    {unitData.unit_options.map((optionalUnit) => {
                      const optionalUnitLessonCount =
                        optionalUnit.lessons.length;
                      return (
                        <Card
                          $pa={16}
                          key={optionalUnit.unitvariant_id}
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
                                  handleOpenModal();
                                  // setUnitOptionsAvailable(false);
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
