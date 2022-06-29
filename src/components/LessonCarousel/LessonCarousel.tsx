import Link from "next/link";
import React, { FC, useEffect, useState } from "react";

import useWindowDimensions from "../../hooks/useWindowsDimentions";
import IconButton from "../Button/IconButton";
import CardAsLink from "../Card/CardAsLink";
import Flex from "../Flex";
import Grid, { GridArea } from "../Grid";
import { Heading, P, Span } from "../Typography";
import { getBreakpoint } from "../../styles/utils/responsive";

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
  const { width } = useWindowDimensions();

  useEffect(() => {
    setCurrentIndex(currentLesson - 1);
  }, [currentLesson]);

  const colSpan =
    width <= getBreakpoint("small")
      ? 12
      : width < getBreakpoint("large")
      ? 6
      : 3;

  const numberOfLessons =
    width <= getBreakpoint("small")
      ? 1
      : width < getBreakpoint("large")
      ? 2
      : 4;

  const lessonsToShow = unit.slice(
    currentIndex,
    currentIndex + numberOfLessons
  );

  const next = () => {
    setCurrentIndex(currentIndex + SLIDE_PER_CLICK);
  };

  const prev = () => {
    setCurrentIndex(currentIndex - SLIDE_PER_CLICK);
  };

  const shouldDisableNext =
    currentIndex + SLIDE_PER_CLICK >= unit.length - (numberOfLessons - 1);
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
            <GridArea colSpan={colSpan}>
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
