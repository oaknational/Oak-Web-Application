import React from "react";
import {
  OakHeading,
  OakSecondaryButton,
  OakFlex,
} from "@oaknational/oak-components";

import { getContainerId } from "../LessonItemContainer/LessonItemContainer";

const LessonOverviewVocabButton = () => {
  return (
    <OakFlex $gap={"spacing-24"} $flexDirection={"column"}>
      <OakHeading $font={["heading-6", "heading-5"]} tag="h3">
        Vocabulary and transcripts for this lessons
      </OakHeading>
      <OakSecondaryButton
        width={"auto"}
        onClick={() => {
          document.getElementById("additional-material")?.scrollIntoView();
          document
            .getElementById(getContainerId("additional-material"))
            ?.focus();
        }}
      >
        View vocabulary and transcripts in additional material
      </OakSecondaryButton>
    </OakFlex>
  );
};

export default LessonOverviewVocabButton;
