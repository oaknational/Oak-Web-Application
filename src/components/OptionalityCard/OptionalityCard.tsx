import React, { FC } from "react";

import Box from "@/components/Box";
import Flex from "@/components/Flex";
import { Heading } from "@/components/Typography";
import { ListTitle } from "@/components/UnitAndLessonLists/ListItemHeader";
import UnitListItem from "@/components/UnitAndLessonLists/UnitList/UnitListItem/UnitListItem";
import OutlineHeading from "@/components/OutlineHeading/OutlineHeading";
import { UnitData } from "@/node-lib/curriculum-api";

type UnitOption = Omit<UnitData, "unitStudyOrder">;

type OptionalityCardProps = {
  unitOptions: UnitOption[];
  index: number;
};

const OptionalityCard: FC<OptionalityCardProps> = ({ unitOptions, index }) => {
  const stringIndex = (index + 1).toString();
  const unitTitle = unitOptions[0]?.nullTitle;

  return (
    <Box
      $background={"lavender30"}
      $mb={16}
      $borderRadius={4}
      data-testid="unit-optionality-card"
    >
      <Flex>
        <Flex
          $flexDirection={"column"}
          $alignItems={"center"}
          $justifyContent={"center"}
          $pt={[0, 12]}
          $pb={[0, 12]}
          $maxWidth={[64, 80]}
        >
          <Heading tag="h6" $font={"heading-7"} $textAlign={"center"} $mv={0}>
            Unit Options
          </Heading>
          <OutlineHeading
            tag={"div"}
            $fontSize={[24, 32]}
            $lightShadow={null}
            ariaHidden={true}
          >
            {stringIndex}
          </OutlineHeading>
        </Flex>
        <Flex
          $flexDirection={["column"]}
          $pl={[16, 24]}
          $pr={[16, 24]}
          $pt={12}
          $pb={12}
          $width={"100%"}
        >
          <Flex $mb={16}>
            <ListTitle index={index}>{unitTitle}</ListTitle>
          </Flex>
          <Flex $gap={[0, 12]} $width={"100%"} $flexWrap={"wrap"}>
            {unitOptions.map((unitOption: UnitOption) => {
              return (
                <Flex $width={["100%", "calc(50% - 6px)"]}>
                  <UnitListItem
                    {...unitOption}
                    hideTopHeading
                    title={unitOption.title}
                    subjectSlug={unitOption.subjectSlug}
                    index={index}
                    expired={false}
                    fromSearchPage={false}
                    isUnitOption={true}
                  />
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default OptionalityCard;
