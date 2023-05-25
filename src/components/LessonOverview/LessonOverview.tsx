import React from "react";

import Flex from "../Flex";
import Heading from "../Typography";
import UL from "../Typography/UL";
import LI from "../Typography/LI";

type CoreContent = {
  coreContent: (string | null)[];
};

const LessonOverview = ({ coreContent }: CoreContent) => {
  return (
    <Flex $justifyContent={"center"} $width={"100%"}>
      <Flex
        $pa={[10, 24]}
        $flexDirection={"column"}
        $mt={22}
        $position={"relative"}
        $justifyContent={"center"}
        $width={["100%", 840]}
      >
        <Heading $font={"heading-5"} $mb={[16, 24]} data-testid={"heading"}>
          Core content
        </Heading>
        <UL $pl={24}>
          {coreContent.map((contentString, i) => {
            if (!contentString) {
              return null;
            }
            return (
              <LI
                key={`core-content-string-${i}`}
                $font={["list-item-2", "list-item-1"]}
              >
                {contentString}
              </LI>
            );
          })}
        </UL>
      </Flex>
    </Flex>
  );
};

export default LessonOverview;
