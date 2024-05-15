import React, { FC } from "react";
import {
  OakHeading,
  OakFlex,
  OakLink,
  OakBox,
} from "@oaknational/oak-components";

import PostPortableText from "../PostPortableText/PostPortableText";

import { PortableTextJSON } from "@/common-lib/cms-types";

type LessonPlanningBlogProps = {
  title: string;
  blogPortableText: PortableTextJSON;
  anchorId?: string;
  linkHref?: string;
};

const LessonPlanningBlog: FC<LessonPlanningBlogProps> = ({
  title,
  blogPortableText,
  linkHref,
}) => {
  return (
    <OakFlex $flexDirection={"column"} $mb={"space-between-xxxl"}>
      <OakHeading tag="h2" $font={["heading-5", "heading-4"]}>
        {title}
      </OakHeading>
      <PostPortableText portableText={blogPortableText} />
      <OakBox $display={["block", "block", "none"]} $mt={"space-between-m2"}>
        <OakLink
          isTrailingIcon
          iconName="arrow-left"
          href={linkHref || "#plan-a-lesson-contents"}
        >
          {"Back to contents"}
        </OakLink>
      </OakBox>
    </OakFlex>
  );
};

export default LessonPlanningBlog;
