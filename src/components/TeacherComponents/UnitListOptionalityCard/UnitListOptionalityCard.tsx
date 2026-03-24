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
      $background={"bg-decorative3-very-subdued"}
      $mb="spacing-16"
      $borderRadius="border-radius-s"
      data-testid="unit-optionality-card"
      role="listitem"
    >
      <OakFlex>
        <OakFlex
          $flexDirection={"column"}
          $alignItems={"center"}
          $justifyContent={"center"}
          $pt={["spacing-0", "spacing-12"]}
          $pb={["spacing-0", "spacing-12"]}
          $maxWidth={["spacing-64", "spacing-80"]}
        >
          <OakHeading
            tag="h6"
            $font={"heading-7"}
            $textAlign={"center"}
            $mv="spacing-0"
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
          $pl={["spacing-16", "spacing-24"]}
          $pr={["spacing-16", "spacing-24"]}
          $pt={"spacing-12"}
          $pb={"spacing-12"}
          $width={"100%"}
        >
          <OakFlex $mb={"spacing-16"} $flexDirection={"column"}>
            <OakP
              $font={"heading-light-7"}
              $mt="spacing-4"
              $color={"text-subdued"}
              $mb="spacing-8"
            >
              {unitYear}
            </OakP>
            <OakHeading tag="h6" $font={"heading-6"} $mv="spacing-0">
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
