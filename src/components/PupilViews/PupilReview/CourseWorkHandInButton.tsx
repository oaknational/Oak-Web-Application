import { useState } from "react";
import {
  OakFlex,
  OakHeading,
  OakIcon,
  OakLoadingSpinner,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import { AsyncState } from "@/common-lib/types/asyncState.types";
import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";

type CourseWorkHandInButtonProps = {
  assignmentToken: string;
  initialIsHandedIn?: boolean;
};

export const CourseWorkHandInButton = ({
  assignmentToken,
  initialIsHandedIn,
}: CourseWorkHandInButtonProps) => {
  const [handInState, setHandInState] = useState<AsyncState>(
    initialIsHandedIn ? "success" : "idle",
  );

  let handInButtonLabel = "Hand in";
  if (handInState === "loading") handInButtonLabel = "Handing in…";
  if (handInState === "success") handInButtonLabel = "Handed in";

  const handleHandIn = async () => {
    setHandInState("loading");
    try {
      await googleClassroomApi.turnInCourseWork(assignmentToken);
      setHandInState("success");
    } catch {
      setHandInState("error");
    }
  };

  return (
    <OakFlex $flexDirection="column" $gap="spacing-4">
      <OakPrimaryButton
        onClick={handleHandIn}
        disabled={handInState === "loading" || handInState === "success"}
        iconName={handInState === "success" ? "tick" : "arrow-right"}
        isTrailingIcon
      >
        {handInButtonLabel}
      </OakPrimaryButton>
      {handInState === "loading" && (
        <OakLoadingSpinner $width="spacing-48" $color="icon-brand" />
      )}
      {handInState === "success" && (
        <OakFlex $gap="spacing-4" $alignItems="center">
          <OakIcon iconName="tick" $colorFilter="text-success" />
          <OakHeading tag="h2" $font="heading-light-7" $color="text-success">
            Assignment handed in successfully!
          </OakHeading>
        </OakFlex>
      )}
      {handInState === "error" && (
        <OakFlex $gap="spacing-4" $alignItems="center">
          <OakIcon iconName="cross" $colorFilter="text-error" />
          <OakHeading tag="h2" $font="heading-light-7" $color="text-error">
            Failed to hand in. Please try again.
          </OakHeading>
        </OakFlex>
      )}
    </OakFlex>
  );
};
