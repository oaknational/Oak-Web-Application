import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";

import useWindowDimensions from "../../hooks/useWindowsSize";
import IconButton from "../Button/IconButton";
import CardAsLink from "../Card/CardAsLink";
import Flex from "../Flex";
import Grid, { GridArea } from "../Grid";
import { Heading, HeadingTag, P, Span } from "../Typography";
import LineClamp from "../LineClamp";

const AnchorP = styled(P)`
  z-index: 1;
`;

type LessonCardProps = {
  title: string;
  slug: string;
  keyStage: string;
  keyStageSlug: string;
  subject: string;
  subjectSlug: string;
  topic: string;
  topicSlug: string;
  lessonNumber: number;
};

const SLIDE_PER_CLICK = 1;

export type LessonCarouselProps = {
  unit: LessonCardProps[];
  currentLesson: number;
  titleTag: HeadingTag;
  cardTitleTag: HeadingTag;
};

const LessonCarousel: FC<LessonCarouselProps> = ({
  unit,
  currentLesson,
  titleTag,
  cardTitleTag,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { breakpoint } = useWindowDimensions();

  useEffect(() => {
    setCurrentIndex(currentLesson - 1);
  }, [currentLesson]);

  // Sets the number of columns to display from window breakpoint
  const carouselColSpan =
    breakpoint === "small" ? 12 : breakpoint === "medium" ? 6 : 3; // large;

  // Sets the number of lessons to render into the carousel
  const numberOfLessons =
    breakpoint === "small" ? 1 : breakpoint === "medium" ? 2 : 4; // large;

  // Slice lesson array by number of lessons
  const lessonsToShow = unit.slice(
    currentIndex,
    currentIndex + numberOfLessons
  );

  // next lesson button
  const next = () => {
    setCurrentIndex(currentIndex + SLIDE_PER_CLICK);
  };
  const shouldDisableNext =
    currentIndex + SLIDE_PER_CLICK >= unit.length - (numberOfLessons - 1);

  // prev lesson button
  const prev = () => {
    setCurrentIndex(currentIndex - SLIDE_PER_CLICK);
  };

  const shouldDisablePrev = currentIndex < SLIDE_PER_CLICK;

  return (
    <Flex
      pa={24}
      flexDirection={"column"}
      aria-label={"Carousel of all the lessons included in this unit"}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Flex
          alignItems={["flex-start", "flex-end"]}
          flexDirection={["column", "row"]}
          mb={32}
        >
          <Heading mr={12} tag={titleTag} fontSize={24}>
            More lessons from this unit
          </Heading>
          <Span fontSize={16}>
            <Link href="/">See all</Link>
          </Span>
        </Flex>
        <Flex mb={32} alignItems={"center"} flexDirection={"row"}>
          <P>{`${currentIndex + SLIDE_PER_CLICK}-${
            currentIndex + numberOfLessons
          } / ${unit.length}`}</P>

          <IconButton
            icon="ChevronRight"
            onClick={prev}
            aria-label={"Show previous lesson"}
            disabled={shouldDisablePrev}
            ml={12}
          />
          <IconButton
            onClick={next}
            icon="ChevronRight"
            aria-label={"Show next lesson"}
            disabled={shouldDisableNext}
            ml={12}
            mr={8}
          />
        </Flex>
      </Flex>
      <Grid role="group">
        {lessonsToShow.map(
          ({
            title,
            slug,
            keyStage,
            keyStageSlug,
            subject,
            subjectSlug,
            topic,
            topicSlug,
            lessonNumber,
          }) => (
            <GridArea colSpan={carouselColSpan}>
              <CardAsLink
                background={"white"}
                mr={8}
                href={slug}
                ariaLabel={"Macbeth"}
                aria-selected={currentLesson === lessonNumber}
              >
                <Heading
                  color={currentLesson === lessonNumber ? "grey6" : undefined}
                  fontSize={20}
                  mb={16}
                  tag={cardTitleTag}
                >
                  <LineClamp lines={1}>
                    <Span>{title}</Span>
                  </LineClamp>
                </Heading>
                <Flex
                  color={currentLesson === lessonNumber ? "grey6" : undefined}
                >
                  <AnchorP
                    color={currentLesson === lessonNumber ? "grey6" : undefined}
                    fontSize={14}
                    mb={16}
                    mr={4}
                  >
                    <Link href={keyStageSlug}>{`${keyStage},`}</Link>
                  </AnchorP>
                  <AnchorP
                    color={currentLesson === lessonNumber ? "grey6" : undefined}
                    fontSize={14}
                    mb={16}
                    mr={4}
                  >
                    <Link href={subjectSlug}>{`${subject},`}</Link>
                  </AnchorP>
                  <AnchorP
                    color={currentLesson === lessonNumber ? "grey6" : undefined}
                    fontSize={14}
                    mb={16}
                    mr={4}
                  >
                    <Link href={topicSlug}>{`${topic}`}</Link>
                  </AnchorP>
                </Flex>
                <P
                  color={currentLesson === lessonNumber ? "grey6" : undefined}
                  fontSize={14}
                  mb={16}
                  mr={4}
                >
                  {`Lesson ${lessonNumber}`}
                </P>
              </CardAsLink>
            </GridArea>
          )
        )}
      </Grid>
    </Flex>
  );
};

export default LessonCarousel;
