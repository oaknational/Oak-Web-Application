import React from "react";

import Flex from "@/components/Flex";
import { LI, P, Span, UL, Heading } from "@/components/Typography";

export type KeyWord = {
  keyword: string;
  description: string | null;
};

export type KeyWordsAndDescription = {
  keyWords: KeyWord[];
};

const KeyWords = ({ keyWords }: KeyWordsAndDescription) => {
  return (
    <Flex
      $flexDirection={"column"}
      $position={"relative"}
      $justifyContent={"center"}
    >
      <Heading $font={"heading-5"} $mb={24} data-testid={"heading"} tag="h3">
        Keywords
      </Heading>
      <UL $reset>
        {keyWords.map((keyWord: KeyWord, i: number) => {
          const capitalisedKeyword =
            keyWord.keyword.charAt(0).toUpperCase() + keyWord.keyword.slice(1);

          const description = `- ${keyWord.description}`;
          return (
            <LI key={`${keyWord.keyword}-${i}`} $mb={12}>
              <P>
                <Span $font={["body-2", "body-1"]}>
                  <Span $font={["body-2-bold", "body-1-bold"]}>
                    {capitalisedKeyword}
                  </Span>{" "}
                  {!keyWord.description ? null : description}
                </Span>
              </P>
            </LI>
          );
        })}
      </UL>
    </Flex>
  );
};

export default KeyWords;
