import React, { FC } from "react";
import Link from "next/link";

import Box from "@/components/Box/Box";
import Flex from "@/components/Flex/Flex";
import P, { Heading } from "@/components/Typography";
import Card from "@/components/Card/Card";
import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";
import Icon from "@/components/Icon/Icon";
import Radio from "@/components/RadioButtons/Radio";
import RadioGroup from "@/components/RadioButtons/RadioGroup";

type UnitsTabProps = {
  data: CurriculumUnitsTabData;
};

const SequenceTab: FC<UnitsTabProps> = ({ data }) => {
  const { units, threads, years } = data;
  return (
    <Box $maxWidth={"80%"} $ma={"auto"} $pb={80}>
      <Card $background={"lemon30"} $pa={0} $pl={96} $mv={48}>
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
          <Heading tag={"h2"} $font={"heading-7"} $mb={12}>
            Introducing our new curriculum sequence for 2023/2024!
          </Heading>
          <P>
            Units that make up our curricula are fully sequenced, and aligned to
            the national curriculum.
          </P>
        </Box>
      </Card>
      <Flex $justifyContent={"space-between"}>
        <Box $minWidth={"20%"} $maxWidth={"20%"} $mr={10}>
          <Box>
            <Box $mb={36}>
              <Heading
                tag={"h3"}
                $font={"heading-6"}
                $mv={12}
                data-testid="heading"
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
        </Box>

        <Box>
          {[6, 7, 8].map((year) => (
            <Box $background={"pink30"} $pt={16} $pl={16} $mb={12}>
              <Heading tag="h4" $font={"heading-6"} $mb={16}>
                Year {year}
              </Heading>
              <Flex
                $flexWrap={"wrap"}
                $flexGrow={"unset"}
                data-testid="unit-cards"
              >
                {units.map((unit) => {
                  return (
                    <Card
                      key={unit.slug}
                      $background={"white"}
                      $mb={16}
                      $mr={16}
                      $pb={56}
                      $maxWidth={"calc(33% - 16px)"}
                      $borderRadius={8}
                      data-testid={"unitCard"}
                      $position={"relative"}
                    >
                      <Heading tag={"h3"} $font={"heading-7"}>
                        {unit.title}
                      </Heading>
                      <Box
                        $position={"absolute"}
                        $bottom={16}
                        $right={16}
                        $font={"body-2-bold"}
                      >
                        <Link href={"curriculum-info"}>
                          Unit info
                          <Icon name="chevron-right" verticalAlign="bottom" />
                        </Link>
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
export default SequenceTab;
