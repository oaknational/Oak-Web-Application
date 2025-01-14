import { FC } from "react";
import { OakHeading, OakP, OakFlex, OakBox } from "@oaknational/oak-components";

import Button from "@/components/SharedComponents/Button";
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
    <OakBox
      $width={["100%", "all-spacing-21"]}
      $height={"max-content"}
      $position="relative"
      $background="grey30"
      data-testid="details-completed"
    >
      <BrushBorders color="grey30" />
      <OakFlex
        $flexDirection="column"
        $gap="all-spacing-6"
        $pa="inner-padding-xl"
        $alignItems="flex-start"
      >
        <OakFlex $flexDirection="column" $gap="all-spacing-4">
          <OakFlex $flexDirection="column" $gap="all-spacing-1">
            <OakHeading tag="h3" $font="heading-7">
              School
            </OakHeading>
            <OakP $font={"body-2"}>{getSchoolName(school)}</OakP>
          </OakFlex>
          <OakFlex
            $flexDirection="column"
            $gap="all-spacing-1"
            $overflow={"anywhere"}
          >
            <OakHeading tag="h3" $font="heading-7">
              Email
            </OakHeading>
            <OakP $font={"body-2"}>{email ? email : "Not provided"}</OakP>
          </OakFlex>
        </OakFlex>
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
      </OakFlex>
    </OakBox>
  );
};

export default ResourcePageDetailsCompleted;
