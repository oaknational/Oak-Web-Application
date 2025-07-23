import React, { FC } from "react";
import { OakFlex, OakBox, OakHeading, OakP } from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import UnitListItem, {
  SpecialistListItemProps,
  UnitListItemProps,
} from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading/OutlineHeading";
import { ReshapedUnitData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

export type UnitOption = Omit<ReshapedUnitData, "unitStudyOrder">;

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
    <OakBox
      $background={"lavender30"}
      $mb="space-between-s"
      $borderRadius="border-radius-s"
      data-testid="unit-optionality-card"
      role="listitem"
    >
      <OakFlex>
        <OakFlex
          $flexDirection={"column"}
          $alignItems={"center"}
          $justifyContent={"center"}
          $pt={["inner-padding-none", "inner-padding-s"]}
          $pb={["inner-padding-none", "inner-padding-s"]}
          $maxWidth={["all-spacing-11", "all-spacing-13"]}
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
        </OakFlex>
        <OakFlex
          $flexDirection={["column"]}
          $pl={["inner-padding-m", "inner-padding-xl"]}
          $pr={["inner-padding-m", "inner-padding-xl"]}
          $pt={"inner-padding-s"}
          $pb={"inner-padding-s"}
          $width={"100%"}
        >
          <OakFlex $mb={"space-between-s"} $flexDirection={"column"}>
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
          </OakFlex>
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
        </OakFlex>
      </OakFlex>
    </OakBox>
  );
};

export default UnitListOptionalityCard;
