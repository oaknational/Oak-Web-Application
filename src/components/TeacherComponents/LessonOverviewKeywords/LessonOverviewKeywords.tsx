import React from "react";
import {
  OakLI,
  OakP,
  OakSpan,
  OakUL,
  OakHeading,
  OakFlex,
} from "@oaknational/oak-components";

export type LessonOverviewKeywordProps = {
  keyword: string;
  description: string | null;
};

export type LessonOverviewKeywordsProps = {
  keyWords: LessonOverviewKeywordProps[];
};

const LessonOverviewKeywords = ({ keyWords }: LessonOverviewKeywordsProps) => {
  return (
    <OakFlex
      $flexDirection={"column"}
      $position={"relative"}
      $justifyContent={"center"}
    >
      <OakHeading
        $font={"heading-5"}
        $mb="spacing-24"
        data-testid={"heading"}
        tag="h3"
      >
        Keywords
      </OakHeading>
      <OakUL $reset>
        {keyWords.map((keyWord: LessonOverviewKeywordProps, i: number) => {
          const capitalisedKeyword =
            keyWord.keyword.charAt(0).toUpperCase() + keyWord.keyword.slice(1);

          const description = `- ${keyWord.description}`;
          return (
            <OakLI key={`${keyWord.keyword}-${i}`} $mb="spacing-12">
              <OakP>
                <OakSpan $font={["body-2", "body-1"]}>
                  <OakSpan $font={["body-2-bold", "body-1-bold"]}>
                    {capitalisedKeyword}
                  </OakSpan>{" "}
                  {!keyWord.description ? null : description}
                </OakSpan>
              </OakP>
            </OakLI>
          );
        })}
      </OakUL>
    </OakFlex>
  );
};

export default LessonOverviewKeywords;
