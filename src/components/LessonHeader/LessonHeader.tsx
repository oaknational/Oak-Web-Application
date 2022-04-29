import { FC } from "react";

import { LessonId } from "../../hooks/useBookmarks";
import BookmarkLessonButton from "../BookmarkLessonButton";
import Button from "../Button";
import ButtonGroup from "../ButtonGroup/ButtonGroup";

import styles from "./LessonHeader.module.css";

type LessonHeaderProps = {
  id: LessonId;
  title: string;
  slug: string;
};
const LessonHeader: FC<LessonHeaderProps> = (props) => {
  const { title, id } = props;
  return (
    <header className={styles.header}>
      <h1>{title}</h1>
      <ButtonGroup>
        <Button
          href="/"
          label="Download"
          aria-label="Download Lesson"
          icon="Download"
        />
        <Button href="/" label="Share" aria-label="Share Lesson" icon="Share" />
        <BookmarkLessonButton lessonId={id} />
      </ButtonGroup>
    </header>
  );
};

export default LessonHeader;
