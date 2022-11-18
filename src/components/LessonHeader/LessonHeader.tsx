import { FC } from "react";

import { LessonId } from "../../context/Bookmarks";
import BookmarkLessonButton from "../BookmarkLessonButton";
import Box from "../Box";
import ButtonAsLink from "../Button/ButtonAsLink";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import Flex from "../Flex";
import { Heading, Span } from "../Typography";

type LessonHeaderProps = {
  id: LessonId;
  title: string;
  slug: string;
};
const LessonHeader: FC<LessonHeaderProps> = (props) => {
  const { title, id } = props;
  return (
    <Flex
      $flexDirection={["column", "row"]}
      $justifyContent={["initial", "space-between"]}
      $alignItems={["initial", "center"]}
    >
      <Flex>
        <Heading tag="h1" $font={"heading-4"}>
          <Box $mb={8}>
            <Span $font={"heading-5"}>Lesson</Span>
          </Box>
          {title}
        </Heading>
      </Flex>
      <ButtonGroup>
        <ButtonAsLink
          page="home"
          label="Download"
          aria-label="Download Lesson"
          icon="Download"
        />
        <ButtonAsLink
          page="home"
          label="Share"
          aria-label="Share Lesson"
          icon="Share"
        />
        <BookmarkLessonButton lessonId={id} />
      </ButtonGroup>
    </Flex>
  );
};

export default LessonHeader;
