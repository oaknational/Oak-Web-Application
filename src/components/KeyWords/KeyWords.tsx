import React from "react";

import Flex from "../Flex";
import Heading, { LI, P, Span, UL } from "../Typography";
import { KeyWord } from "../LessonDetails/LessonDetails";

export type KeyWordsAndDescription = { keyWords: KeyWord[] };

const KeyWords = ({ keyWords }: KeyWordsAndDescription) => {
  return (
    <Flex $justifyContent={"center"} $width={"100%"}>
      <Flex
        $flexDirection={"column"}
        $position={"relative"}
        $justifyContent={"center"}
        $width={["100%", 840]}
      >
        <Heading $font={"heading-5"} $mb={24} data-testid={"heading"}>
          Key words
        </Heading>
        <UL $reset>
          {keyWords.map((keyWord: KeyWord, i: number) => {
            const capitalisedKeyword =
              keyWord.keyword.charAt(0).toUpperCase() +
              keyWord.keyword.slice(1);
            return (
              <LI key={`${keyWord.keyword}-${i}`} $mb={12}>
                <P>
                  <Span $font={["body-2", "body-1"]}>
                    <Span $font={["body-2-bold", "body-1-bold"]}>
                      {capitalisedKeyword}
                    </Span>{" "}
                    – {keyWord.description}
                  </Span>
                </P>
              </LI>
            );
          })}
        </UL>
      </Flex>
    </Flex>
  );
};

export default KeyWords;
