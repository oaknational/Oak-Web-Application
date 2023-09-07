import React, { FC } from "react";

import Flex from "../Flex";
import Grid, { GridArea } from "../Grid";
import Heading from "../Typography/Heading";
import UnitListItem from "../UnitAndLessonLists/UnitList/UnitListItem";
import ButtonAsLink from "../Button/ButtonAsLink";
import TagPromotional from "../TagPromotional";
import { UnitListItemProps } from "../UnitAndLessonLists/UnitList/UnitListItem/UnitListItem";
import MaxWidth from "../MaxWidth/MaxWidth";
import Box from "../Box";

import { OakColorName } from "@/styles/theme";
import { ViewType } from "@/common-lib/urls";

export type EarlyReleaseExemplarUnitsProps = {
  quote: {
    text: string;
    author: string;
    occupation: string;
    school?: string;
  };
  color: OakColorName;
  units: UnitListItemProps[];
  heading: string;
  subHeading: string;
  viewType: ViewType;
  subjectIconBackground?: OakColorName;
};

const EarlyReleaseExemplarUnits: FC<EarlyReleaseExemplarUnitsProps> = ({
  quote,
  color,
  units,
  heading,
  subHeading,
  viewType,
  subjectIconBackground,
}) => {
  return (
    <Box $background={color}>
      <MaxWidth $ph={16} $background={color}>
        <Grid $pt={56} $background={color}>
          <GridArea $order={[2, 1]} $colSpan={[12, 6]}>
            <Flex $mb={[56, 0]} $flexDirection={"column"}>
              <Flex>
                <Heading
                  $mb={16}
                  $font={["heading-4", "heading-4", "heading-3"]}
                  tag={"h2"}
                >
                  {heading}
                </Heading>
                <TagPromotional
                  size={"large"}
                  $color={"mint"}
                  $ml={[16, 16, 24]}
                  $mt={[8, 8, 10]}
                />
              </Flex>
              <Heading $font={"heading-7"} tag={"h3"}>
                {subHeading}
              </Heading>
            </Flex>
          </GridArea>
          <GridArea $order={[1, 2]} $mb={[48, 56]} $colSpan={[12, 6]}>
            <Flex
              $width="100%"
              $flexDirection={"column"}
              $alignItems={"flex-end"}
            >
              <Flex
                $flexDirection={"column"}
                $justifyContent={"flex-end"}
                $width={["100%", 300, 524]}
              >
                <Heading
                  $textAlign={"right"}
                  $mb={16}
                  $font={["heading-6", "heading-6", "heading-5"]}
                  tag={"h3"}
                >
                  &ldquo;{quote.text}&rdquo;
                </Heading>
                <Heading
                  $textAlign={"right"}
                  $font={["heading-7", "heading-7"]}
                  tag={"h4"}
                >
                  {quote.author}
                </Heading>
                <Heading $textAlign={"right"} $font={["body-3"]} tag={"h4"}>
                  {quote.occupation}
                </Heading>
                {quote.school && (
                  <Heading $textAlign={"right"} $font={["body-3"]} tag={"h4"}>
                    {quote.school}
                  </Heading>
                )}
              </Flex>
            </Flex>
          </GridArea>
        </Grid>
        <Grid $cg={16} role={"list"} $background={color}>
          {units.map((unit) => (
            <GridArea
              key={`${unit.slug}:${unit.index}`}
              role={"listitem"}
              $order={3}
              $colSpan={[12, 6]}
            >
              <UnitListItem
                isExemplarUnit={true}
                fromSearchPage={true}
                subjectIconBackground={subjectIconBackground}
                {...unit}
              />
            </GridArea>
          ))}

          <GridArea $order={4} $colSpan={[12, 12]}>
            <Flex
              $justifyContent={"flex-end"}
              $mb={[56, 56]}
              $mt={[40, 40]}
              $mr={4}
            >
              <ButtonAsLink
                variant={"minimal"}
                viewType={viewType}
                page={"curriculum-landing-page"}
                label={"View new curriculum plans"}
                icon={"arrow-right"}
                $iconPosition={"trailing"}
                iconBackground={"black"}
              />
            </Flex>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Box>
  );
};

export default EarlyReleaseExemplarUnits;
