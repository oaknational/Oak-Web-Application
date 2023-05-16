import React from "react";

import Flex from "../Flex";
import Heading from "../Typography";
// import UL from "../Typography/UL";
// import LI from "../Typography/LI";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";

// type CoreContent = {
//   coreContent: string | null[];
// };

const LessonOverview = () => {
  return (
    <Flex $justifyContent={"center"} $width={"100%"}>
      <Flex
        $background={"teachersPastelYellow"}
        $pa={[16, 24]}
        $flexDirection={"column"}
        $mt={22}
        $alignItems={"center"}
        $position={"relative"}
      >
        <Heading $font={"heading-6"} $mb={16}>
          Core content
        </Heading>
        {/* <UL $pl={28}>
          {coreContent.map((contentString, i) => {
            if (!contentString) {
              return null;
            }
            return (
              <LI key={`core-content-string-${i}`} $font={"list-item-1"}>
                {contentString}
              </LI>
            );
          })}
        </UL> */}
        <BrushBorders
          hideOnMobileH
          hideOnMobileV
          color={"teachersPastelYellow"}
        />
      </Flex>
    </Flex>
  );
};

export default LessonOverview;
