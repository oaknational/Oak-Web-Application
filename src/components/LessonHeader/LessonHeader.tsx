import { FC } from "react";
import styled from "styled-components";

import { LessonId } from "../../context/Bookmarks";
import BookmarkLessonButton from "../BookmarkLessonButton";
import ButtonAsLink from "../Button/ButtonAsLink";
import ButtonGroup from "../ButtonGroup/ButtonGroup";

const StyledLessonHeader = styled.header`
  display: flex;
  flex-direction: column;
  @media (min-width: 900px) {
    flex-direction: row;
    justify-content: space-between;

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
      <h1>{title}</h1>
      <ButtonGroup>
        <ButtonAsLink
          href="/"
          label="Download"
          aria-label="Download Lesson"
          icon="Download"
        />
        <ButtonAsLink
          href="/"
          label="Share"
          aria-label="Share Lesson"
          icon="Share"
        />
        <BookmarkLessonButton lessonId={id} />
      </ButtonGroup>
    </StyledLessonHeader>
  );
};

export default LessonHeader;
