import React, { FC } from "react";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import { Heading, P } from "@/components/SharedComponents/Typography";
import UnitListItem, {
  SpecialistListItemProps,
  UnitListItemProps,
} from "@/components/UnitAndLessonLists/UnitList/UnitListItem/UnitListItem";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading/OutlineHeading";
import { UnitData } from "@/node-lib/curriculum-api";
import {
  IndividualSpecialistUnit,
  SpecialistUnit,
} from "@/components/TeacherViews/SpecialistUnitListing/SpecialistUnitListing.view";

export type UnitOption = Omit<UnitData, "unitStudyOrder">;

type OptionalityCardProps = {
  unitOptions: UnitOption[] | SpecialistUnit;
  index: number;
  onClick: (props: UnitListItemProps | SpecialistListItemProps) => void;
};

const OptionalityCard: FC<OptionalityCardProps> = ({
  unitOptions,
  index,
  onClick,
}) => {
  const stringIndex = (index + 1).toString();
  const unitTitle = unitOptions[0]?.nullTitle;

  let unitYear;

  if (unitOptions[0] && "yearTitle" in unitOptions[0]) {
    unitYear = unitOptions[0].yearTitle;
  }

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
            Unit options
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
          <Flex $mb={16} $flexDirection={"column"}>
            <P $font={"heading-light-7"} $mt={4} $color={"grey60"} $mb={8}>
              {unitYear}
            </P>
            <Heading tag="h6" $font={"heading-6"} $mv={0}>
              {unitTitle}
            </Heading>
          </Flex>
          <Flex $cg={12} $width={"100%"} $flexWrap={"wrap"}>
            {unitOptions.map(
              (unitOption: UnitOption | IndividualSpecialistUnit) => {
                return (
                  <Flex
                    $width={["100%", "calc(50% - 6px)"]}
                    key={unitOption.slug}
                  >
                    <UnitListItem
                      {...unitOption}
                      hideTopHeading
                      title={unitOption.title}
                      subjectSlug={unitOption.subjectSlug}
                      index={index}
                      expired={false}
                      isUnitOption={true}
                      onClick={onClick}
                    />
                  </Flex>
                );
              },
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default OptionalityCard;
