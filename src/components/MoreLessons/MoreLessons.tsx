import React, { FC, useRef, useState } from "react";
import styled from "styled-components";

import IconButton from "../Button/IconButton";
import Flex from "../Flex";
import { Heading } from "../Typography";

import LessonCard, { LessonCardProps } from "./LessonCard";

const CardSliderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const Slider = styled.div`
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow-x: scroll;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const SLIDE_PER_CLICK = 1;

export type MoreLessonProps = {
  unit: LessonCardProps[];
};

const MoreLessons: FC<MoreLessonProps> = ({ unit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const lessonsToShow = unit.slice(currentIndex, currentIndex + 4);

  const next = () => {
    setCurrentIndex(currentIndex + SLIDE_PER_CLICK);
  };

  const prev = () => {
    setCurrentIndex(currentIndex - SLIDE_PER_CLICK);
  };

  const shouldDisableNext = currentIndex + SLIDE_PER_CLICK >= unit.length - 3;
  const shouldDisablePrev = currentIndex < SLIDE_PER_CLICK;

  const sliderRef = useRef(null);

  return (
    <div>
      <Flex mb={24} justifyContent={"space-between"}>
        <Flex alignItems={"center"} flexDirection={"row"}>
          <Heading tag="h3" size={4}>
            More lessons from this unit
          </Heading>
          <a href="">see all</a>
        </Flex>
        <Flex flexDirection={"row"}>
          <IconButton
            icon="ChevronRight"
            onClick={prev}
            aria-label={"Show previous lesson"}
            disabled={shouldDisablePrev}
          />
          <IconButton
            onClick={next}
            icon="Download"
            aria-label={"Show next lesson"}
            disabled={shouldDisableNext}
          />
        </Flex>
      </Flex>

      <CardSliderContainer>
        <Slider ref={sliderRef}>
          {lessonsToShow.map((lesson) => (
            <LessonCard
              key={lesson.index}
              lessonTitle={lesson.lessonTitle}
              keyStage={lesson.keyStage}
              subject={lesson.subject}
              topic={lesson.topic}
              index={lesson.index}
            />
          ))}
        </Slider>
      </CardSliderContainer>
    </div>
  );
};

export default MoreLessons;
