import { FC } from "react";

import Box from "../../Box";
import Flex from "../../Flex";
import Icon from "../../Icon";
import OakImage from "../../OakImage";
import Typography, { Heading, LI, UL } from "../../Typography";
import { QuizQuestionListProps } from "../QuestionsList/QuestionsList";

export type QuestionListItemProps = QuizQuestionListProps["questions"][0];

const QuestionListItem: FC<QuestionListItemProps> = (props) => {
  const { title, images, choiceImages, choices, answer, type, displayNumber } =
    props;
  return (
    <LI $mb={32}>
      <Flex $mb={12}>
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
                <Box $position="relative" $minHeight={200} $ml={[0, 48]} $mb={24}>
                  {" "}
                  <OakImage
                    fill
                    objectFit="contain"
                    $objectPosition={["center", "left"]}
                    src={image}
                    alt={"quiz image"}
                  />
                </Box>
              );
            } else {
              const { title, images } = image;
              return (
                <>
                  {images.map((image) => {
                    return (
                      <Box $position="relative" $minHeight={200} $ml={[0, 48]} $mb={24}>
                        {" "}
                        <OakImage
                          fill
                          $objectFit="contain"
                          $objectPosition={["center", "left"]}
                          src={image}
                          alt={title}
                        />
                      </Box>
                    );
                  })}
                </>
              );
            }
          }
        })}
      {choices && choices.length > 0 ? (
        <UL $pl={0}>
          {choices.map((choice, index) => {
            if (typeof answer === "string") {
              if (answer === choice) {
                if (choiceImages && choiceImages.length > 0) {
                  const choiceImagesString: string = choiceImages[
                    index
                  ] as string;
                  return (
                    <>
                      {" "}
                      <Box $position="relative" $minHeight={200} $ml={[0, 50]} $mb={24}>
                        {" "}
                        <OakImage
                          fill
                          $objectFit="contain"
                          $objectPosition={["center", "left"]}
                          src={choiceImagesString}
                          alt={"quiz image"}
                        />
                      </Box>
                      <Flex>
                        <Typography
                          $font={["body-1"]}
                          $background={"teachersPastelYellow"}
                          $borderRadius={8}
                          $mb={6}
                          $ph={10}
                          $display={"flex"}
                        >
                          <Icon name={"Tick"} $mr={16} />

                          {choice}
                        </Typography>
                      </Flex>
                    </>
                  );
                } else {
                  return (
                    <Flex>
                      <Typography
                        $font={["body-1"]}
                        $background={"teachersPastelYellow"}
                        $borderRadius={8}
                        $mb={6}
                        $ph={10}
                        $display={"flex"}
                      >
                        <Icon name={"Tick"} $mr={16} />

                        {choice}
                      </Typography>
                    </Flex>
                  );
                }
              } else {
                if (choiceImages && choiceImages.length > 0) {
                  const choiceImagesString: string = choiceImages[
                    index
                  ] as string;
                  return (
                    <>
                      <Box $position="relative" $minHeight={200} $ml={[0, 50]} $mb={24}>
                        {" "}
                        <OakImage
                          fill
                          $objectFit="contain"
                          $objectPosition={["center", "left"]}
                          src={choiceImagesString}
                          alt={"quiz image"}
                        />
                      </Box>
                      <Typography $mb={6} $font={["body-1"]} $ml={40} $ph={10}>
                        {choice}
                      </Typography>
                    </>
                  );
                } else {
                  return (
                    <Typography $mb={6} $font={["body-1"]} $ml={40} $ph={10}>
                      {choice}
                    </Typography>
                  );
                }
              }
            } else if ([...answer].indexOf(choice) >= 0 || type === "match") {
              return (
                <>
                  {" "}
                  <Flex>
                    <Flex
                      $display={"inline-flex"}
                      $background={"teachersPastelYellow"}
                      $borderRadius={8}
                      $mb={6}
                      $ph={10}
                      $alignItems={"center"}
                    >
                      {" "}
                      <Icon name={"Tick"} $mr={16} />
                      {type === "order" && (
                        <Heading $font={"heading-7"} tag={"h6"} $ma={0} $mr={6}>
                          {index + 1} -
                        </Heading>
                      )}
                      {type === "match" && (
                        <Heading $font={"heading-7"} tag={"h6"} $ma={0} $mr={6}>
                          {answer[index]} -
                        </Heading>
                      )}
                      <Typography $font={["body-1"]}>{choice}</Typography>
                    </Flex>
                  </Flex>
                </>
              );
            } else {
              return (
                <Typography $mb={6} $ml={40} $font={["body-1"]} $ph={10}>
                  {choice}
                </Typography>
              );
            }
          })}
        </UL>
      ) : (
        <Flex $display={"flex"} $flexDirection={"column"}>
          {[...answer].map((ans) => {
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
                  <Icon name={"Tick"} $mr={16} />
                  <Typography $font={["body-1"]}>{ans}</Typography>
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      )}
    </LI>
  );
};

export default QuestionListItem;
