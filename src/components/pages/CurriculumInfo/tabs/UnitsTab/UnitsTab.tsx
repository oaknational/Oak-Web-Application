import React, { FC } from "react";

import Box from "@/components/Box/Box";
import Flex from "@/components/Flex/Flex";
import P, { Heading } from "@/components/Typography";
import Card from "@/components/Card/Card";
import DropdownSelect from "@/components/DropdownSelect/DropdownSelect";
import { CurriculumUnitsTabData } from "@/node-lib/curriculum-api-2023";

type UnitsTabProps = {
  data: CurriculumUnitsTabData;
};

const SequenceTab: FC<UnitsTabProps> = ({ data }) => {
  const { units, threads } = data;
  return (
    <Box $maxWidth={"80%"} $ma={"auto"} $pb={80}>
      <Flex $justifyContent={"space-between"}>
        <Box $minWidth={"20%"} $maxWidth={"20%"} $mr={10}>
          <DropdownSelect
            $mv={10}
            name="year-group-selection"
            id={`year-group-seleciton`}
            $mt={32}
            label="Year group"
            placeholder="All"
            listItems={[
              { label: "All", value: "all" },
              { label: "Year 7", value: "year7" },
            ]}
            onChange={() => {
              return [];
            }}
          />

          <Box>
            <Box>
              <Heading
                tag={"h3"}
                $font={"heading-7"}
                $mv={12}
                data-testid="heading"
              >
                Threads
              </Heading>
              <P $mv={6}>Select to highlight in the curriculum sequence</P>
              <Flex $flexDirection={"column"}>
                {threads.map((thread) => (
                  <Card
                    key={thread.slug}
                    $background={"aqua50"}
                    $mv={4}
                    $pa={10}
                    $borderRadius={6}
                    data-testid={"threadOption"}
                  >
                    {thread.title}
                  </Card>
                ))}
              </Flex>
            </Box>
          </Box>
        </Box>

        <Box>
          <Heading tag="h4" $font={"heading-6"} $mv={20}>
            Year 10
          </Heading>{" "}
          <Flex $maxWidth={"85%"} $flexWrap={"wrap"} data-testid="unit-cards">
            {units.map((unit) => {
              return (
                <Card
                  key={unit.slug}
                  $background={"aqua30"}
                  $mv={8}
                  $ml={12}
                  $maxWidth={"30%"}
                  $borderRadius={8}
                  data-testid={"unitCard"}
                >
                  <Heading tag={"h3"} $font={"heading-7"}>
                    {unit.title}
                  </Heading>
                  <P $textAlign={"right"}>Unit info</P>
                </Card>
              );
            })}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
export default SequenceTab;
