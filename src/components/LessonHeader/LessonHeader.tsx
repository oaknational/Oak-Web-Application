import { FC } from "react";

import Button from "../Button";
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
      <div>
        <Button href="/" label="Download" icon="Download" />
        <Button href="/" label="Share" icon="Share" />
        <IconButton href="/" icon="Star" />
      </div>
    </header>
  );
};

export default LessonHeader;
