import React, { FC } from "react";

import Box from "@/components/Box/Box";
import Flex from "@/components/Flex/Flex";
import P, { Heading } from "@/components/Typography";
import Card from "@/components/Card/Card";
import {
  CurriculumUnit,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import Icon from "@/components/Icon/Icon";
import OutlineHeading from "@/components/OutlineHeading/OutlineHeading";
import OakLink from "@/components/OakLink/OakLink";
// import Radio from "@/components/RadioButtons/Radio";
// import RadioGroup from "@/components/RadioButtons/RadioGroup";

type UnitsTabProps = {
  data: CurriculumUnitsTabData;
};

const UnitsTab: FC<UnitsTabProps> = ({ data }) => {
  const { units } = data;
  const unitsByYear: { [key: string]: CurriculumUnit[] } = {};
  units.forEach((unit) => {
    if (!unitsByYear[unit.year]) {
      unitsByYear[unit.year] = [];
    }
    unitsByYear[unit.year]?.push(unit);
  });
  const buildProgrammeSlug = (unit: CurriculumUnit) => {
    let slug = `${unit.subject_slug}-${unit.phase_slug}-${unit.keystage_slug}`;
    if (unit.tier_slug) {
      slug = `${slug}-${unit.tier_slug}`;
    }
    if (unit.examboard_slug) {
      slug = `${slug}-${unit.examboard_slug}`;
    }
    return slug;
  };

  return (
    <Box $maxWidth={["100%", "80%"]} $ma={"auto"} $pb={80}>
      <Card
        $background={"lemon30"}
        $pa={0}
        $pl={96}
        $mv={[16, 48]}
        $mh={[16, 0]}
      >
        <Box
          $background={"lemon"}
          $height={"100%"}
          $left={0}
          $position={"absolute"}
          $top={0}
          $width={96}
          $textAlign={"center"}
        >
          <Icon
            name={"bell"}
            size={[48]}
            $position={"relative"}
            $transform={"translateY(-50%)"}
            $top={"50%"}
          />
        </Box>
        <Box $pa={20}>
          <Heading
            tag={"h2"}
            $font={"heading-7"}
            $mb={12}
            data-testid="heading"
          >
            Introducing our new curriculum sequence for 2023/2024!
          </Heading>
          <P>
            Units that make up our curricula are fully sequenced, and aligned to
            the national curriculum.
          </P>
        </Box>
      </Card>
      <Flex $justifyContent={"space-between"}>
        {/* <Box $minWidth={"20%"} $maxWidth={"20%"} $mr={10}>
          <Box>
            <Box $mb={36}>
              <Heading
                tag={"h3"}
                $font={"heading-6"}
                $mv={12}
              >
                Highlight a thread
              </Heading>
              <P $mv={6}>
                Threads are groups of units across the curriculum that build a
                common body of knowledge.
              </P>
              <RadioGroup>
                {threads.map((thread) => (
                  <Box
                    $ba={1}
                    $borderColor="grey3"
                    $borderRadius={4}
                    $ph={12}
                    $pt={12}
                    $mb={6}
                  >
                    <Radio
                      key={thread.slug}
                      value={thread.slug}
                      data-testid="threadOption"
                    >
                      {thread.title}
                    </Radio>
                  </Box>
                ))}
              </RadioGroup>
            </Box>
            <Box>
              <Heading
                tag={"h3"}
                $font={"heading-6"}
                $mv={12}
                data-testid="heading"
              >
                Year group
              </Heading>
              <RadioGroup>
                {years.map((year) => (
                  <Box
                    $ba={1}
                    $borderColor="grey3"
                    $borderRadius={4}
                    $ph={12}
                    $pt={12}
                    $mb={6}
                  >
                    <Radio key={year} value={`${year}`}>
                      {year}
                    </Radio>
                  </Box>
                ))}
              </RadioGroup>
            </Box>
          </Box>
        </Box> */}

        <Box>
          {Object.keys(unitsByYear).map((year) => (
            <Box key={year} $background={"pink30"} $pt={16} $pl={16} $mb={36}>
              <Heading tag="h4" $font={"heading-4"} $mb={16}>
                Year {year}
              </Heading>
              <Flex $flexWrap={"wrap"} data-testid="unit-cards">
                {unitsByYear[year]?.map((unit, index) => {
                  return (
                    <Card
                      key={unit.slug}
                      $background={"white"}
                      $mb={16}
                      $mr={16}
                      $pb={64}
                      $width={["100%", "calc(33% - 16px)"]}
                      $borderRadius={8}
                      data-testid={"unitCard"}
                      $position={"relative"}
                      $flexGrow={"unset"}
                    >
                      <OutlineHeading tag={"h3"} $fontSize={24} $mb={12}>
                        {index + 1}
                      </OutlineHeading>
                      <Heading tag={"h3"} $font={"heading-7"}>
                        {unit.title}
                      </Heading>
                      <Box
                        $position={"absolute"}
                        $bottom={16}
                        $right={16}
                        $font={"body-2-bold"}
                      >
                        <OakLink
                          page="lesson-index"
                          viewType="teachers-2023"
                          programmeSlug={buildProgrammeSlug(unit)}
                          unitSlug={unit.slug}
                          data-testid="unitLink"
                        >
                          Unit info
                          <Icon name="chevron-right" verticalAlign="bottom" />
                        </OakLink>
                      </Box>
                    </Card>
                  );
                })}
              </Flex>
            </Box>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};
export default UnitsTab;
