import { FC, useState, ReactNode } from "react";

import { shortAnswerTitleFormatter, removeMarkdown } from "./quizUtils";

import Box from "@/components/Box";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import ImageBox from "@/components/ImageBox/ImageBox";
import OakImage from "@/components/OakImage";
import Typography, { Heading } from "@/components/Typography";
import {
  LessonOverviewQuizData,
  MCAnswer,
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import { object } from "zod";
import { ca } from "date-fns/locale";
import QuizImage from "./QuizImage";
import BoxBorders from "@/components/SpriteSheet/BrushSvgs/BoxBorders";

export type QuestionListItemProps = {
  question: NonNullable<LessonOverviewQuizData>[number];
  index: number;
};

type AnswerProps = {
  choice: string;
  type: string;
  index: number;
  answer?: string[] | undefined;
};

// commponent for handling the format of the choice when choice === answer

export const CorrectAnswer: FC<AnswerProps> = ({
  choice,
  type,
  index,
  answer,
}) => {
  const getTypeAnswers = (
    choiceType: AnswerProps["type"],
    answer: AnswerProps["answer"]
  ) => {
    const typeIsMatch = choiceType === "match";
    const typeIsCheckbox = choiceType === "checkbox";
    const answerIsArray = Array.isArray(answer);

    if (typeIsMatch) {
      return (
        <Flex $flexWrap={"wrap"} $alignItems={"center"}>
          {" "}
          <Heading $font={"heading-7"} tag={"h6"} $ma={0} $mr={6}>
            {choice}
          </Heading>
          <Typography $font={"body-1"} $ma={0} $mr={6} data-testid={"answer"}>
            {answer ? " - " + answer[index] : ""}
          </Typography>
        </Flex>
      );
    } else if (typeIsCheckbox) {
      if (answerIsArray) {
        return (
          <Typography $font={["body-1"]}>
            {" "}
            {answer[answer.indexOf(choice)]}
          </Typography>
        );
      } else {
        return <Typography $font={["body-1"]}> {choice}</Typography>;
      }
    } else {
      if (answerIsArray) {
        return (
          <Typography $font={["body-1"]}>
            {" "}
            {"- "}
            {answer[index]}
          </Typography>
        );
      } else {
        return <Typography $font={["body-1"]}> {choice}</Typography>;
      }
    }
  };
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
            {index + 1}
          </Heading>
        )}
        {getTypeAnswers(type, answer)}
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

const MCAnswers = (props: { answers: MCAnswer[]; questionNumber: number }) => {
  const { answers, questionNumber } = props;

  return (
    <Flex $flexDirection={"column"}>
      {answers.map((choice, i) => {
        const encloseAnswer =
          choice.answer.filter((answerItem) => answerItem.type === "image")
            .length > 0;
        return (
          <Flex
            key={`q-${questionNumber}-answer-${i}`}
            $flexDirection={"column"}
            $gap={8}
            $alignItems={encloseAnswer ? "center" : "flex-start"}
            $ph={encloseAnswer ? 10 : 0}
            $pv={encloseAnswer ? 16 : 0}
            $ba={encloseAnswer ? 1 : 0}
            $mb={encloseAnswer ? 8 : 0}
            $borderStyle="solid"
            $borderColor="black"
            $borderRadius={8}
          >
            {choice.answer.map((answerItem, j) => {
              if (answerItem.type === "text" && !choice.answer_is_correct) {
                return (
                  <Typography
                    key={`q-${questionNumber}-answer-element-${j}`}
                    $font={["body-2", "body-1"]}
                    $ph={40}
                  >
                    {answerItem.text}
                  </Typography>
                );
              } else if (
                answerItem.type === "text" &&
                choice.answer_is_correct
              ) {
                return (
                  <Flex
                    key={`q-${questionNumber}-answer-element-${j}`}
                    $background={"teachersPastelYellow"}
                    $borderRadius={8}
                    $ph={8}
                    $alignItems={"center"}
                  >
                    <Box $minWidth={32}>
                      <Icon name={"tick"} />
                    </Box>

                    <Typography $font={["body-2", "body-1"]}>
                      {answerItem.text}
                    </Typography>
                  </Flex>
                );
              } else if (answerItem.type === "image") {
                return (
                  <Flex
                    $ph={40}
                    key={`q-${questionNumber}-answer-element-${j}`}
                  >
                    <QuizImage
                      src={answerItem.image_object}
                      alt="An image supporting the question"
                    />
                  </Flex>
                );
              }
            })}
          </Flex>
        );
      })}
    </Flex>
  );
};

const QuestionListItem: FC<QuestionListItemProps> = (props) => {
  console.log("QuestionListItem props", props);

  // const {
  //   title: markdownTitle,
  //   images,
  //   choices,
  //   answer,
  //   type,
  //   displayNumber,
  // } = props;

  const { question, index } = props;
  const displayNumber = `Q${index + 1}.`;
  const { questionStem, answers } = question;

  // const title = removeMarkdown(markdownTitle);

  // const joinAnswer = type === "short-answer" && Array.isArray(answer);
  // const joinedAnswer = joinAnswer ? answer.join(", ") : "";
  // const joinedAnswerIndex = 0;

  return (
    <Flex $flexDirection={"column"} $width={"100%"} role="listitem" $gap={8}>
      {/* QUESTION BLOCK */}

      <Flex $flexDirection={"column"} $gap={4}>
        <Flex>
          {displayNumber && (
            <Typography $font={["body-2-bold", "body-1-bold"]} $mr={12}>
              {displayNumber}
            </Typography>
          )}
          {questionStem[0]?.type === "text" && (
            <Typography
              key={`q-${displayNumber}-stem-element-0`}
              $font={["body-2-bold", "body-1-bold"]}
            >
              {questionStem[0].text}
            </Typography>
          )}
        </Flex>

        {questionStem.map((stemItem, i) => {
          if (stemItem.type === "text" && i > 0) {
            return (
              <Typography
                key={`q-${displayNumber}-stem-element-${i}`}
                $font={["body-2-bold", "body-1-bold"]}
              >
                {stemItem.text}
              </Typography>
            );
          } else if (stemItem.type === "image") {
            return (
              <QuizImage
                key={`q-${displayNumber}-stem-element-${i}`}
                src={stemItem.image_object}
                alt="An image supporting the question"
              />
            );
          } else {
            return <></>;
          }
        })}
      </Flex>

      {/* ANSWER BLOCK */}
      {answers["multiple-choice"] && answers["multiple-choice"].length > 0 && (
        <MCAnswers
          answers={answers["multiple-choice"]}
          questionNumber={index}
        />
      )}

      {/* {choices && choices.length > 0 ? (
        <Flex
          $flexDirection={"column"}
          $width={"max-content"}
          $maxWidth={"100%"}
        >
          {choices.map((choiceObj, index) => {
            const { choice, image } = choiceObj;
            const choiceIsCorrectAnswer = answer === choice;
            if (typeof answer === "string" && choiceIsCorrectAnswer) {
              return (
                <>
                  {image ? (
                    <AnswerBox>
                      <>
                        <QuizImage src={image} alt={""} />
                        <CorrectAnswer
                          choice={choice}
                          type={type}
                          index={index}
                        />
                      </>
                    </AnswerBox>
                  ) : (
                    <CorrectAnswer choice={choice} type={type} index={index} />
                  )}
                </>
              );
            } else if (
              typeof answer !== "string" &&
              choiceIsInAnswerArray(answer, choice, type)
            ) {
              return (
                <>
                  {image ? (
                    <AnswerBox>
                      <>
                        <QuizImage src={image} alt={""} />
                        <CorrectAnswer
                          type={type}
                          choice={choice}
                          index={index}
                          answer={answer}
                        />
                      </>
                    </AnswerBox>
                  ) : (
                    <CorrectAnswer
                      type={type}
                      choice={choice}
                      index={index}
                      answer={answer}
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
                        <QuizImage src={image} alt={""} />
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
          })}
        </Flex>
      ) : (
        <Flex
          $flexDirection={"column"}
          $width={"max-content"}
          $maxWidth={"100%"}
        >
          {type === "short-answer" ? (
            <CorrectAnswer
              choice={joinedAnswer}
              type={type}
              index={joinedAnswerIndex}
            />
          ) : (
            [...answer].map((ans, index) => {
              return <CorrectAnswer choice={ans} index={index} type={type} />;
            })
          )}
        </Flex>
      )}  */}
    </Flex>
  );
};

export default QuestionListItem;
