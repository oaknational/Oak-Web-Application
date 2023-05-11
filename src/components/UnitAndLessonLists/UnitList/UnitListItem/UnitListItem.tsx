import { FC } from "react";

import useClickableCard from "../../../../hooks/useClickableCard";
import useAnalytics from "../../../../context/Analytics/useAnalytics";
import Flex from "../../../Flex";
import { Span } from "../../../Typography";
import ListItemHeader from "../../ListItemHeader";
import ListItemCard from "../../ListItemCard";
import { UnitListingData } from "../../../../node-lib/curriculum-api";
import Expired from "../../Expired";
import type { KeyStageTitleValueType } from "../../../../browser-lib/avo/Avo";
import useAnalyticsPageProps from "../../../../hooks/useAnalyticsPageProps";

export type UnitListItemProps = Omit<
  UnitListingData["units"][number],
  "year" | "unitStudyOrder"
> & {
  hideTopHeading?: boolean;
  index: number | null;
};

/**
 * Contains an title, icon, leaning theme, number of lessons and optional Unit Quiz .
 * Links to a lesson-index page
 *
 *
 */
const UnitListItem: FC<UnitListItemProps> = (props) => {
  const {
    title,
    slug,
    themeTitle,
    lessonCount,
    index,
    expired,
    expiredLessonCount,
    subjectSlug,
    subjectTitle,
    keyStageSlug,
    keyStageTitle,
  } = props;

  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const trackUnitSelected = () => {
    track.unitSelected({
      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
      keyStageSlug,
      subjectTitle,
      subjectSlug,
      unitName: title,
      unitSlug: slug,
      analyticsUseCase,
    });
  };

  const { isHovered, primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>();

  return (
    <ListItemCard
      title={title}
      subjectSlug={subjectSlug}
      isHovered={isHovered}
      containerProps={containerProps}
      background={"teachersLilac"}
      expired={expired}
    >
      <Flex
        $ml={[16, 24]}
        $mr={[0, 24]}
        $flexDirection={"column"}
        $width={"100%"}
        $pb={24}
      >
        <ListItemHeader
          {...props}
          primaryTargetProps={primaryTargetProps}
          page={"Unit"}
          index={index}
          onClick={trackUnitSelected}
        />
        {expired ? (
          <Expired page={"unit"} />
        ) : (
          <Flex $flexDirection={["column", "row"]}>
            {themeTitle && (
              <Span
                dangerouslySetInnerHTML={{
                  __html: themeTitle,
                }}
                $mr={16}
                $mb={[4, 0]}
                $font={["body-3", "heading-light-7"]}
              />
            )}
            <Flex>
              {lessonCount && expiredLessonCount ? (
                <Span $mr={16} $font={["body-3", "heading-light-7"]}>
                  {`${lessonCount - expiredLessonCount}/${lessonCount} lessons`}
                </Span>
              ) : (
                <Span $mr={16} $font={["body-3", "heading-light-7"]}>
                  {lessonCount && `${lessonCount} lessons`}
                </Span>
              )}
            </Flex>
          </Flex>
        )}
      </Flex>
    </ListItemCard>
  );
};

export default UnitListItem;
