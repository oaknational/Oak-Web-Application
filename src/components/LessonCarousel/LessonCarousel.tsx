import Link from "next/link";
import React, { FC, useEffect, useState } from "react";

import useWindowDimensions from "../../hooks/useWindowsSize";
import IconButton from "../Button/IconButton";
import CardAsLink from "../Card/CardAsLink";
import Flex from "../Flex";
import Grid, { GridArea } from "../Grid";
import { Heading, P, Span } from "../Typography";

type LessonCardProps = {
  lessonTitle: string;
  keyStage: "KS1" | "KS2" | "KS3" | "KS4";
  subject: string;
  topic: string;
  index: number;
};

const SLIDE_PER_CLICK = 1;

export type LessonCarouselProps = {
  unit: LessonCardProps[];
  currentLesson: number;
};

const LessonCarousel: FC<LessonCarouselProps> = ({
  unit,
  currentLesson = 2,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { breakpoint } = useWindowDimensions();

  console.log("break", breakpoint);

  useEffect(() => {
    setCurrentIndex(currentLesson - 1);
  }, [currentLesson]);

  // Sets the number of columns to display from window breakpoint
  const carouselColSpan =
    breakpoint === "small" ? 12 : breakpoint === "medium" ? 6 : 3; // large;

  // Sets the number of lessosn to render into the carousel
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
    <section aria-label={"lesson carousel"}>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Flex
          alignItems={["flex-start", "flex-end"]}
          flexDirection={["column", "row"]}
          mb={32}
        >
          <Heading mr={12} tag="h3" fontSize={24}>
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
          />
        </Flex>
      </Flex>
      <Grid role="group">
        {lessonsToShow.map(
          ({ lessonTitle, keyStage, subject, topic, index }) => (
            <GridArea colSpan={carouselColSpan}>
              <CardAsLink mr={8} background={"grey5"} href={"/"} ariaLabel={""}>
                <Heading fontSize={16} tag={"h3"}>
                  {lessonTitle}
                </Heading>
                <P>{`${keyStage}, ${subject}, ${topic}`}</P>
                <P>{`Lesson ${index}`}</P>
                {index === currentLesson + 1 && <p>----</p>}
              </CardAsLink>
            </GridArea>
          )
        )}
      </Grid>
    </section>
  );
};

export default LessonCarousel;
