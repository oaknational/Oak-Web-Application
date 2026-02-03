import { FC } from "react";
import {
  OakHeading,
  OakP,
  OakFlex,
  OakBox,
  OakPrimaryButton,
} from "@oaknational/oak-components";

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
      $width={["100%", "spacing-480"]}
      $height={"max-content"}
      $position="relative"
      $background="bg-neutral-stronger"
      $borderRadius={"border-radius-m"}
      data-testid="details-completed"
    >
      <OakFlex
        $flexDirection="column"
        $gap="spacing-24"
        $pa="spacing-24"
        $alignItems="flex-start"
      >
        <OakFlex $flexDirection="column" $gap="spacing-16">
          <OakFlex $flexDirection="column" $gap="spacing-4">
            <OakHeading tag="h3" $font="heading-7">
              School
            </OakHeading>
            <OakP $font={"body-2"}>{getSchoolName(school)}</OakP>
          </OakFlex>
          <OakFlex
            $flexDirection="column"
            $gap="spacing-4"
            $overflow={"anywhere"}
          >
            <OakHeading tag="h3" $font="heading-7">
              Email
            </OakHeading>
            <OakP $font={"body-2"}>{email ? email : "Not provided"}</OakP>
          </OakFlex>
        </OakFlex>
        <OakBox $mt="spacing-8">
          <OakPrimaryButton
            iconName="edit"
            isTrailingIcon
            onClick={() => {
              onEditClick();
            }}
            aria-label="Edit details"
          >
            Edit
          </OakPrimaryButton>
        </OakBox>
      </OakFlex>
    </OakBox>
  );
};

export default ResourcePageDetailsCompleted;
