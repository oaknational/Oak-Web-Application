import React, { FC } from "react";

import { Span } from "@/components/SharedComponents/Typography";

type CategoryHeadingProps = {
  keyStageTitle?: string;
  subjectTitle?: string;
  page: "Unit" | "Lesson";
};

const CategoryHeading: FC<CategoryHeadingProps> = ({
  keyStageTitle,
  subjectTitle,
  page,
}) => {
  return (
    <Span
      $font={["heading-light-7", "heading-light-6"]}
      $color={"grey60"}
      $mb={4}
    >{`${keyStageTitle}, ${subjectTitle}, ${page}:`}</Span>
  );
};

export default CategoryHeading;
