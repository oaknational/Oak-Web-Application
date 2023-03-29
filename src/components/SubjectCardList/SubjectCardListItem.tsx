import { FC } from "react";

import useAnalytics from "../../context/Analytics/useAnalytics";
import useUseCase from "../../hooks/useUseCase";
import type { KeyStageNameValueType } from "../../browser-lib/avo/Avo";
import Typography, { Heading, HeadingTag } from "../Typography";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import useClickableCard from "../../hooks/useClickableCard";
import Flex from "../Flex";
import OakLink from "../OakLink";
import { SvgName } from "../SpriteSheet/getSvgId";
import Card, { CardProps } from "../Card";
import { ResolveOakHrefProps } from "../../common-lib/urls";
import SubjectIcon from "../SubjectIcon";

export type SubjectCardListItemProps = Omit<CardProps, "children"> & {
  title: string;
  slug: string;
  keyStageSlug: string;
  keyStageTitle: string;
  activeUnitCount: number | null;
  lessonCount: number | null;
  tierCount: number | null;
  titleTag?: HeadingTag;
  svgName?: SvgName;
};

const SubjectCardListItem: FC<SubjectCardListItemProps> = ({
  title,
  slug,
  titleTag = "h3",
  keyStageSlug,
  keyStageTitle,
  lessonCount,
  tierCount,
  activeUnitCount,
}) => {
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();

  const isAvailable = Boolean(lessonCount);
  const backgroundColor = isAvailable ? "teachersPastelYellow" : "white";

  const linkProps: ResolveOakHrefProps = tierCount
    ? { page: "tier-selection", keyStage: keyStageSlug, subject: slug }
    : { page: "unit-index", keyStage: keyStageSlug, subject: slug };

  const { track } = useAnalytics();
  const useCase = useUseCase();

  return (
    <Card
      {...(isAvailable && { ...containerProps })}
      $flexDirection={"column"}
      $alignItems="stretch"
      $background={"white"}
      $pa={[0, 0]}
      $mb={[16, 0]}
    >
      <Flex
        $background={backgroundColor}
        $position={"relative"}
        $width={"100%"}
        $pv={16}
      >
        <SubjectIcon
          subjectSlug={slug}
          height={96}
          width={96}
          $width={96}
          $ma={"auto"}
          $transform={isHovered ? "scale(1)" : "scale(0.8)"}
        />
      </Flex>
      <Flex
        $flexDirection={"column"}
        $position={"relative"}
        $width={"100%"}
        $justifyContent={"center"}
        $alignItems={"center"}
        $pv={8}
        $ph={8}
        $transform={isHovered ? "translateY(-8px)" : null}
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
        $transition={"all 0.3s ease"}
        $minHeight={110}
      >
        {isAvailable ? (
          <>
            <Heading $font={["heading-7"]} tag={titleTag} $textAlign={"center"}>
              <OakLink
                {...primaryTargetProps}
                {...linkProps}
                onClick={() => {
                  track.subjectSelected({
                    keyStageName: keyStageTitle as KeyStageNameValueType,
                    keyStageSlug,
                    subjectName: slug,
                    subjectSlug: slug,
                    useCase,
                  });
                }}
              >
                {title}
              </OakLink>
            </Heading>
            <Typography
              $font={"body-2"}
              $color={"oakGrey4"}
            >{`${activeUnitCount} units`}</Typography>
            <Typography
              $font={"body-2"}
              $color={"oakGrey4"}
            >{`${lessonCount} lessons`}</Typography>
          </>
        ) : (
          <Heading $font={["heading-7"]} tag={titleTag} $textAlign={"center"}>
            {title}
          </Heading>
        )}
      </Flex>
      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default SubjectCardListItem;
