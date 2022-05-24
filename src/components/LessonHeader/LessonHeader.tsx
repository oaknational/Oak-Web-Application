import { FC } from "react";
import styled from "styled-components";

import { LessonId } from "../../context/Bookmarks";
import { getBreakpoint } from "../../styles/utils/responsive";
import BookmarkLessonButton from "../BookmarkLessonButton";
import ButtonAsLink from "../Button/ButtonAsLink";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import Flex from "../Flex";
import { Heading } from "../Typography";
import { Span } from "../Typography/Typography";

const StyledLessonHeader = styled.header`
  display: flex;
  flex-direction: column;

  @media (min-width: ${getBreakpoint("medium")}px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

type LessonHeaderProps = {
  id: LessonId;
  title: string;
  slug: string;
};
const LessonHeader: FC<LessonHeaderProps> = (props) => {
  const { title, id } = props;
  return (
    <StyledLessonHeader>
      <Flex>
        <Heading tag="h1" size={4}>
          <Span display="block" fontSize={24}>
            Lesson
          </Span>
          {title}
        </Heading>
      </Flex>
      <ButtonGroup>
        <ButtonAsLink
          href="/"
          label="Download"
          aria-label="Download Lesson"
          icon="Download"
          variant="secondary"
        />
        <ButtonAsLink
          href="/"
          label="Share"
          aria-label="Share Lesson"
          icon="Share"
          variant="secondary"
        />
        <BookmarkLessonButton lessonId={id} />
      </ButtonGroup>
    </StyledLessonHeader>
  );
};

export default LessonHeader;
