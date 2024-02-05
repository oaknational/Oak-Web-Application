import React, { FC } from "react";
import { OakHeading, OakP } from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import UnitListItem, {
  SpecialistListItemProps,
  UnitListItemProps,
} from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading/OutlineHeading";
import { UnitData } from "@/node-lib/curriculum-api";

export type UnitOption = Omit<UnitData, "unitStudyOrder">;

type UnitListOptionalityCardProps = {
  unitOptions: UnitOption[];
  index: number;
  onClick: (props: UnitListItemProps | SpecialistListItemProps) => void;
};

const UnitListOptionalityCard: FC<UnitListOptionalityCardProps> = ({
  unitOptions,
  index,
  onClick,
}) => {
  const stringIndex = (index + 1).toString();
  const unitTitle = unitOptions[0]?.nullTitle;
  const unitYear = unitOptions[0]?.yearTitle;

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
          <OakHeading
            tag="h6"
            $font={"heading-7"}
            $textAlign={"center"}
            $mv="space-between-none"
          >
            Unit options
          </OakHeading>
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
            <OakP
              $font={"heading-light-7"}
              $mt="space-between-sssx"
              $color={"grey60"}
              $mb="space-between-ssx"
            >
              {unitYear}
            </OakP>
            <OakHeading tag="h6" $font={"heading-6"} $mv="space-between-none">
              {unitTitle}
            </OakHeading>
          </Flex>
          <Flex $cg={12} $width={"100%"} $flexWrap={"wrap"}>
            {unitOptions.map((unitOption: UnitOption) => {
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
            })}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default UnitListOptionalityCard;
