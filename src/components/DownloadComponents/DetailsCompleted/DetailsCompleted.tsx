import { FC } from "react";

import { Heading, P } from "@/components/Typography";
import Button from "@/components/Button";
import Flex from "@/components/Flex";
import Box from "@/components/Box";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders";
import Svg from "@/components/Svg";

export type DetailsCompletedProps = {
  email?: string;
  school?: string;
  onEditClick: () => void;
};

const getSchoolName = (school: string | undefined) => {
  if (school === "notListed") {
    return "My school isn’t listed";
  } else if (school === "homeschool") {
    return "Homeschool";
  } else {
    return school;
  }
};

const DetailsCompleted: FC<DetailsCompletedProps> = ({
  email,
  school,
  onEditClick,
}) => {
  return (
    <Box
      $width={["100%", 420]}
      $height={"max-content"}
      $position="relative"
      $background="grey2"
    >
      <BrushBorders color="grey2" />
      <Flex $flexDirection="column" $gap={24} $pa={24} $alignItems="flex-start">
        <Flex $flexDirection="column" $gap={16}>
          <Flex $flexDirection="column" $gap={4}>
            <Heading tag="h3" $font="heading-7">
              School
            </Heading>
            <P $font={"body-2"}>{getSchoolName(school)}</P>
          </Flex>
          <Flex $flexDirection="column" $gap={4}>
            <Heading tag="h3" $font="heading-7">
              Email
            </Heading>
            <P $font={"body-2"} $wordWrap={"break-word"}>
              {email ? email : "Not provided"}
            </P>
            <Svg name="content-guidance" $height={16} $width={16} />
            <Svg name="chevron-left" $height={16} $width={16} />
            <Svg name="tick-mark-happiness" $height={160} $width={160} />
          </Flex>
        </Flex>
        <Button
          label="Edit"
          variant="minimal"
          icon="edit"
          $iconPosition="trailing"
          iconBackground="black"
          onClick={onEditClick}
          $mt={8}
          aria-label="Edit details"
        />
      </Flex>
    </Box>
  );
};

export default DetailsCompleted;
