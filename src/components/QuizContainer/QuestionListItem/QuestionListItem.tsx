import { FC, useState, ReactNode } from "react";

import Box from "../../Box";
import Flex from "../../Flex";
import Icon from "../../Icon";
import ImageBox from "../../ImageBox/ImageBox";
import OakImage from "../../OakImage";
import Typography, { Heading } from "../../Typography";
import { QuizQuestionListProps } from "../QuestionsList/QuestionsList";

export type QuestionListItemProps = QuizQuestionListProps["questions"][0];

type ImageProps = { src: string; alt?: string };

const QuizImage: FC<ImageProps> = ({ src, alt }) => {
  const [dims, setDims] = useState({ height: 0, width: 0 });
  return (
    <ImageBox
      $position={"relative"}
      $imageHeight={dims.height}
      $imageWidth={dims.width}
      $maxWidth={"100%"}
      $maxHeight={200}
      $minHeight={96}
      $ba={8}
      $borderColor={"white"}
      $borderRadius={3}
    >
      <OakImage
        objectFit="contain"
        $objectPosition={["center", "left"]}
        src={src}
        alt={alt ? alt : "quiz image"}
        fill
        onLoad={({ target }) => {
          const { naturalWidth, naturalHeight } = target as HTMLImageElement;
          setDims({ height: naturalHeight, width: naturalWidth });
        }}
      />
    </ImageBox>
  );
};
type AnswerProps = {
  choice: string;
  type: string;
  index: number;
  answer?: string[] | undefined;
};

export const CorrectAnswer: FC<AnswerProps> = ({
  choice,
  type,
  index,
  answer,
}) => {
  const typeIsMatch = type === "match";
  const typeIsCheckbox = type === "checkbox";
  const answerIsArray = Array.isArray(answer);
  return (
    <Flex>
      {" "}
      <Flex
        $display={"inline-flex"}
        $background={"teachersPastelYellow"}
        $borderRadius={8}
        $mb={6}
        $ph={10}
        $alignItems={"center"}
      >
        {" "}
        <Icon name={"tick"} $mr={16} />
        {type === "order" && (
          <Heading $font={"heading-7"} tag={"h6"} $ma={0} $mr={6}>
            {index + 1} -
          </Heading>
        )}
        {typeIsMatch && (
          <Flex $flexWrap={"wrap"} $alignItems={"center"}>
            {" "}
            <Heading $font={"heading-7"} tag={"h6"} $ma={0} $mr={6}>
              {answer ? answer[index] + "  -" : ""}
            </Heading>
            <Typography $font={["body-1"]}> {choice}</Typography>
          </Flex>
        )}
        {typeIsCheckbox && !answerIsArray ? (
          <Typography $font={["body-1"]}> {choice}</Typography>
        ) : null}
        {typeIsCheckbox && answerIsArray ? (
          <Typography $font={["body-1"]}>
            {" "}
            {answer[answer.indexOf(choice)]}
          </Typography>
        ) : null}
        {!typeIsMatch && !typeIsCheckbox && !answerIsArray ? (
          <Typography $font={["body-1"]}> {choice}</Typography>
        ) : null}
        {!typeIsMatch && !typeIsCheckbox && answerIsArray ? (
          <Typography $font={["body-1"]}> {answer[index]}</Typography>
        ) : null}
      </Flex>
    </Flex>
  );
};

const AnswerBox: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box
      $ba={1}
      $borderRadius={3}
      $borderStyle={"solid"}
      $borderColor={"oakGrey3"}
      $mb={32}
      $ph={8}
      $pb={2}
    >
      {children}
    </Box>
  );
};

const choiceIsInAnswerArray = (
  answer: string[],
  choice: string,
  type: string
): boolean => {
  return [...answer].indexOf(choice) >= 0 || type === "match";
};

const QuestionListItem: FC<QuestionListItemProps> = (props) => {
  const { title, images, choices, answer, type, displayNumber } = props;
  return (
    <Flex $flexDirection={"column"} $mb={[0, 16]}>
      <Flex $mb={16}>
        {displayNumber && (
          <Typography $font={["body-1-bold"]} $mr={12}>
            {displayNumber}
          </Typography>
        )}
        <Typography $font={["body-1-bold"]} data-testid={"title-div"}>
          {title}
        </Typography>
      </Flex>

      {images &&
        images.map((image) => {
          if (image) {
            if (typeof image === "string") {
              return (
                <Flex $mb={32}>
                  <QuizImage src={image} />
                </Flex>
              );
            } else {
              const { title, images } = image;
              return (
                <Flex $mb={32}>
                  {images.map((image) => {
                    return <QuizImage src={image} alt={title} />;
                  })}
                </Flex>
              );
            }
          }
        })}

      {choices && choices.length > 0 ? (
        <Flex
          $flexDirection={"column"}
          $width={"max-content"}
          $maxWidth={"100%"}
        >
          {choices.map((choiceObj, index) => {
            const { choice, image } = choiceObj;

            if (typeof answer === "string") {
              const correctAnswer = answer === choice;
              if (correctAnswer) {
                return (
                  <>
                    {image ? (
                      <AnswerBox>
                        <>
                          <QuizImage src={image} alt={"quiz image"} />
                          <CorrectAnswer
                            choice={choice}
                            type={type}
                            index={index}
                          />
                        </>
                      </AnswerBox>
                    ) : (
                      <CorrectAnswer
                        choice={choice}
                        type={type}
                        index={index}
                      />
                    )}
                  </>
                );
              } else {
                return (
                  <>
                    {image ? (
                      <AnswerBox>
                        {" "}
                        <>
                          <QuizImage src={image} alt={"quiz image"} />
                          <Typography
                            $ml={40}
                            $ph={10}
                            $mb={6}
                            $font={["body-1"]}
                          >
                            {choice}
                          </Typography>
                        </>
                      </AnswerBox>
                    ) : (
                      <Typography $ml={40} $ph={10} $mb={6} $font={["body-1"]}>
                        {choice}
                      </Typography>
                    )}
                  </>
                );
              }
            } else if (choiceIsInAnswerArray(answer, choice, type)) {
              return (
                <CorrectAnswer
                  type={type}
                  choice={choice}
                  index={index}
                  answer={answer}
                />
              );
            } else {
              return (
                <Typography $ml={40} $font={["body-1"]} $ph={10} $mb={6}>
                  {choice}
                </Typography>
              );
            }
          })}
        </Flex>
      ) : (
        <Flex
          $flexDirection={"column"}
          $width={"max-content"}
          $maxWidth={"100%"}
        >
          {[...answer].map((ans, index) => {
            return <CorrectAnswer choice={ans} index={index} type={type} />;
          })}
        </Flex>
      )}
    </Flex>
  );
};

export default QuestionListItem;
