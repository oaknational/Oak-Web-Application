import { FC } from "react";
import { OakHeading, OakP } from "@oaknational/oak-components";

import Button from "@/components/SharedComponents/Button";
import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";

export type ResourcePageDetailsCompletedProps = {
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

const ResourcePageDetailsCompleted: FC<ResourcePageDetailsCompletedProps> = ({
  email,
  school,
  onEditClick,
}) => {
  return (
    <Box
      $width={["100%", 420]}
      $height={"max-content"}
      $position="relative"
      $background="grey30"
    >
      <BrushBorders color="grey30" />
      <Flex $flexDirection="column" $gap={24} $pa={24} $alignItems="flex-start">
        <Flex $flexDirection="column" $gap={16}>
          <Flex $flexDirection="column" $gap={4}>
            <OakHeading tag="h3" $font="heading-7">
              School
            </OakHeading>
            <OakP $font={"body-2"}>{getSchoolName(school)}</OakP>
          </Flex>
          <Flex $flexDirection="column" $gap={4} $overflowWrap={"anywhere"}>
            <OakHeading tag="h3" $font="heading-7">
              Email
            </OakHeading>
            <OakP $font={"body-2"}>{email ? email : "Not provided"}</OakP>
          </Flex>
        </Flex>
        <Button
          label="Edit"
          variant="minimal"
          icon="edit"
          $iconPosition="trailing"
          iconBackground="black"
          onClick={() => {
            onEditClick();
          }}
          $mt={8}
          aria-label="Edit details"
        />
      </Flex>
    </Box>
  );
};

export default ResourcePageDetailsCompleted;
