import { FC } from "react";

import Box from "../../Box";
import OakImage from "../../OakImage";
import Typography, { LI, OL } from "../../Typography";
import { QuizProps } from "../QuizContainer";

export type QuizQuestionListProps = {
  listProps: QuizProps["questions"];
};

const QuestionsList: FC<QuizQuestionListProps> = ({ listProps }) => {
  return (
    <OL>
      {listProps.map((question) => {
        const {
          title,
          choices,
          choiceImages,
          answer,
          points,
          images,
          feedbackCorrect,
          feedbackIncorrect,
        } = question;

        return (
          <LI>
            <Typography $mb={32} $font={["body-2", "body-1"]}>
              {title}
            </Typography>
            {images &&
              images.map((image) => {
                if (image) {
                  return (
                    <Box $position="relative" $minHeight={110}>
                      {" "}
                      <OakImage
                        fill
                        $objectFit="contain"
                        $objectPosition="left"
                        src={image}
                        alt={"quiz image"}
                      />
                    </Box>
                  );
                }
              })}
            {choiceImages &&
              choiceImages.map((image) => {
                if (image) {
                  return (
                    <Box $position="relative" $minHeight={110}>
                      {" "}
                      <OakImage
                        fill
                        $objectFit="contain"
                        $objectPosition="left"
                        src={image}
                        alt={"quiz image"}
                      />
                    </Box>
                  );
                }
              })}
            {choices && (
              <Typography $mb={32} $font={["body-2", "body-1"]}>
                choices:
                {choices.map((choice) => {
                  return (
                    <Typography $mb={32} $font={["body-2", "body-1"]}>
                      {choice}
                    </Typography>
                  );
                })}
              </Typography>
            )}

            <Typography $mb={32} $font={["body-2", "body-1"]}>
              answer: {answer}
            </Typography>
            <Typography $mb={32} $font={["body-2", "body-1"]}>
              points: {points}
            </Typography>
            <Typography $mb={32} $font={["body-2", "body-1"]}>
              correct feedback: {feedbackCorrect}
            </Typography>
            <Typography $mb={32} $font={["body-2", "body-1"]}>
              incorrect feedback: {feedbackIncorrect}
            </Typography>
          </LI>
        );
      })}
    </OL>
  );
};

export default QuestionsList;
