import React, { FC } from "react";
import { OakSpan } from "@oaknational/oak-components";

type ListItemHeaderCategoryHeadingProps = {
  keyStageTitle?: string;
  subjectTitle?: string;
  page: "Unit" | "Lesson";
};

const ListItemHeaderCategoryHeading: FC<ListItemHeaderCategoryHeadingProps> = ({
  keyStageTitle,
  subjectTitle,
  page,
}) => {
  return (
    <OakSpan
      $font={["heading-light-7", "heading-light-6"]}
      $color={"grey60"}
      $mb="spacing-4"
    >{`${keyStageTitle}, ${subjectTitle}, ${page}:`}</OakSpan>
  );
};

export default ListItemHeaderCategoryHeading;
