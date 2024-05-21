import React, { FC } from "react";
import { OakHeading, OakFlex } from "@oaknational/oak-components";

import PostPortableText from "../PostPortableText/PostPortableText";

import { PortableTextJSON } from "@/common-lib/cms-types";

type LessonPlanningBlogProps = {
  title: string;
  blogPortableText: PortableTextJSON;
};

const LessonPlanningBlog: FC<LessonPlanningBlogProps> = ({
  title,
  blogPortableText,
}) => {
  return (
    <OakFlex $flexDirection={"column"}>
      <OakHeading tag="h2" $font={["heading-5", "heading-4"]}>
        {title}
      </OakHeading>
      <PostPortableText portableText={blogPortableText} />
    </OakFlex>
  );
};

export default LessonPlanningBlog;
