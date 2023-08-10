import React, { FC } from "react";

import Box from "@/components/Box/Box";
import Flex from "@/components/Flex/Flex";
import P, { Heading } from "@/components/Typography";
import Card from "@/components/Card/Card";
import DropdownSelect from "@/components/DropdownSelect/DropdownSelect";

type SequenceTabProps = {
  units: string[];
  threads: string[];
};

const SequenceTab: FC<SequenceTabProps> = (props: SequenceTabProps) => {
  const { units, threads } = props;
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
              <Heading tag={"h3"} $font={"heading-7"} $mv={12}>
                Threads
              </Heading>
              <P $mv={6}>Select to highlight in the curriculum sequence</P>
              <Flex $flexDirection={"column"}>
                {threads.map((thread, i) => (
                  <Card
                    key={i + "thread"}
                    $background={"aqua50"}
                    $mv={4}
                    $pa={10}
                    $borderRadius={6}
                  >
                    {thread}
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
          <Flex $maxWidth={"85%"} $flexWrap={"wrap"}>
            {units.map((unit, i) => {
              return (
                <Card
                  key={i + "unit"}
                  $background={"aqua30"}
                  $mv={8}
                  $ml={12}
                  $maxWidth={"30%"}
                  $borderRadius={8}
                >
                  <Heading tag={"h3"} $font={"heading-7"}>
                    {unit}
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
