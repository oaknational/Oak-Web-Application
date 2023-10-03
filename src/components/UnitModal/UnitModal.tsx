import React, { FC } from "react";

import Flex from "@/components/Flex";
import Box from "@/components/Box";
import { Heading } from "@/components/Typography";
import Button from "@/components/Button";
import { Unit } from "@/components/pages/CurriculumInfo/tabs/UnitsTab/UnitsTab";
import { TagFunctional } from "@/components/TagFunctional";
import LessonMetadata from "@/components/LessonMetadata";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders";
import Card from "@/components/Card";

type UnitModalProps = {
  unitData: Unit | null;
};

const UnitModal: FC<UnitModalProps> = ({ unitData }) => {
  if (!unitData) return null;
  const uniqueThreads = new Set<string>();
  const unitOptionsAvailable = unitData.unit_options.length > 0;

  unitData.threads.forEach((thread) => {
    uniqueThreads.add(thread.title);
  });

  const uniqueThreadsArray = Array.from(uniqueThreads);

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
            <LessonMetadata
              subjectTitle={unitData.subject}
              yearTitle={`Year ${unitData.year}`}
            />
            <Heading $mb={40} tag="h2" $font={"heading-5"}>
              {unitData.title}
            </Heading>
            {uniqueThreadsArray.length > 0 && (
              <Box $mb={[24, 40]}>
                <Heading tag="h3" $font={"heading-6"} $mb={8}>
                  Threads
                </Heading>
                <Flex
                  $flexDirection={["column", "row"]}
                  $flexWrap={"wrap"}
                  $gap={8}
                  $alignItems={"flex-start"}
                >
                  {uniqueThreadsArray.map((thread) => (
                    <TagFunctional
                      key={thread}
                      text={thread}
                      color={"grey"}
                      data-testid="thread-tag"
                    />
                  ))}
                </Flex>
              </Box>
            )}
            {unitOptionsAvailable && (
              <Box
                $position={"relative"}
                $background={"pink30"}
                $pt={12}
                $pb={24}
                $ph={18}
                $mb={40}
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
                  {unitData.unit_options.map((optionalUnit) => {
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
                        >
                          <Flex
                            $flexDirection={"row"}
                            $alignItems={"flex-start"}
                            $width={"100%"}
                            $color={"oakGrey5"}
                          >
                            <TagFunctional text="Coming soon" color="grey" />
                            <Button
                              disabled={true}
                              label="Unit info"
                              $font={"heading-7"}
                              isCurrent={true}
                              currentStyles={["color"]}
                              icon="chevron-right"
                              iconBackground="white"
                              $iconPosition="trailing"
                              variant="minimal"
                            />
                          </Flex>
                        </Flex>
                      </Card>
                    );
                  })}
                </Flex>
              </Box>
            )}
          </Box>
        </Flex>
      )}
    </>
  );
};

export default UnitModal;
