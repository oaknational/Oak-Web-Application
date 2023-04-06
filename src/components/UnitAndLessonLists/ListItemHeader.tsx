import { FC, MutableRefObject } from "react";

import Flex from "../Flex";
import OakLink from "../OakLink";
import { Heading } from "../Typography";

import CategoryHeading from "./CategoryHeading";
import ListItemIconMobile from "./ListItemIconMobile";
import { LessonListItemProps } from "./LessonList/LessonListItem";
import { UnitListItemProps } from "./UnitList/UnitListItem/UnitListItem";

type PrimaryTargetProps = {
  ref: MutableRefObject<HTMLAnchorElement | null>;
  $isHovered: boolean;
};

interface CommonProps {
  hideTopHeading?: boolean;
  primaryTargetProps: PrimaryTargetProps;
  page: "Unit" | "Lesson";
  expired: boolean | null;
  onClick?: () => void;
}

type ListItemHeadingProps = CommonProps &
  (LessonListItemProps | UnitListItemProps) & { index: number | null };

const ListTitle: FC<{ children?: React.ReactNode; expired?: boolean }> = ({
  children,
  expired,
}) => {
  return (
    <Heading
      $mb={12}
      $color={expired ? "oakGrey4" : "black"}
      $font={["heading-7", expired ? "heading-light-6" : "heading-6"]}
      tag={"h3"}
    >
      {children}
    </Heading>
  );
};

const ListItemHeader: FC<ListItemHeadingProps> = (props) => {
  const {
    title,
    slug,
    keyStageSlug,
    subjectSlug,
    subjectTitle,
    hideTopHeading,
    keyStageTitle,
    primaryTargetProps,
    page,
    index,
    expired,
    onClick,
  } = props;

  if (expired) {
    return (
      <Flex $mt={24} $flexDirection={"column"}>
        <ListTitle expired={expired}>
          {index !== null ? `${index + 1}.` : ""} {title}
        </ListTitle>
      </Flex>
    );
  }

  return (
    <Flex>
      <Flex $mt={24} $flexDirection={"column"}>
        {!hideTopHeading && (
          <CategoryHeading
            keyStageTitle={keyStageTitle}
            subjectTitle={subjectTitle}
            page={page}
          />
        )}
        {"unitSlug" in props ? (
          // lesson
          <OakLink
            slug={slug}
            keyStage={keyStageSlug}
            subject={subjectSlug}
            unit={props.unitSlug}
            page={"lesson-overview"}
            onClick={onClick}
            {...primaryTargetProps}
          >
            <ListTitle>{title}</ListTitle>
          </OakLink>
        ) : (
          // unit
          <OakLink
            slug={slug}
            keyStage={keyStageSlug}
            subject={subjectSlug}
            page={"lesson-index"}
            onClick={onClick}
            {...primaryTargetProps}
          >
            <ListTitle>
              {index !== null ? `${index + 1}.` : ""} {title}
            </ListTitle>
          </OakLink>
        )}
      </Flex>

      <ListItemIconMobile
        background={page == "Unit" ? "teachersLilac" : "pupilsPink"}
        subjectSlug={subjectSlug}
      />
    </Flex>
  );
};

export default ListItemHeader;
