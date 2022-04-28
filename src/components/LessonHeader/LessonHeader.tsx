import { FC } from "react";

import Button from "../Button";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import IconButton from "../IconButton/IconButton";

import styles from "./LessonHeader.module.css";

type LessonHeaderProps = {
  id: string;
  title: string;
  slug: string;
};
const LessonHeader: FC<LessonHeaderProps> = (props) => {
  const { title } = props;
  return (
    <header className={styles.header}>
      <h1>{title}</h1>
      <ButtonGroup>
        <Button href="/" label="Download" icon="Download" />
        <Button href="/" label="Share" icon="Share" />
        <IconButton href="/" icon="Star" aria-label="Add/remove bookmark" />
      </ButtonGroup>
    </header>
  );
};

export default LessonHeader;
