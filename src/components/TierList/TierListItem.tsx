import { FC } from "react";

import useAnalytics from "../../context/Analytics/useAnalytics";
import useUseCase from "../../hooks/useUseCase";
import type { KeyStageNameValueType } from "../../browser-lib/avo/Avo";
import Flex from "../Flex";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import { Heading, Span } from "../Typography";
import { OakColorName } from "../../styles/theme/types";
import OakLink from "../OakLink";
import Card from "../Card";
import useClickableCard from "../../hooks/useClickableCard";
import Box from "../Box";

export type TierListItemProps = {
  title: string;
  slug: string;
  keyStageSlug: string;
  subjectSlug: string;
  subjectName: string;
  keyStageName: string;
  unitCount: number | null;
  lessonCount: number | null;
};

const TierListItem: FC<TierListItemProps & { background: OakColorName }> = (
  props
) => {
  const {
    title,
    slug,
    subjectSlug,
    subjectName,
    keyStageSlug,
    keyStageName,
    background,
    lessonCount,
    unitCount,
  } = props;
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();

  const { track } = useAnalytics();
  const useCase = useUseCase();

  return (
    <Card $overflow={"hidden"} {...containerProps} $pa={0}>
      <Flex
        $transform={isHovered ? "translateY(-4px)" : null}
        $transition={"all 0.4s ease-out"}
        $background={background}
      >
        <OakLink
          {...primaryTargetProps}
          page={"unit-index"}
          keyStage={keyStageSlug}
          subject={subjectSlug}
          search={{ tier: slug }}
          onClick={() => {
            track.tierSelected({
              unitName: "",
              unitSlug: "",
              unitId: 0,
              subjectName,
              subjectSlug,
              keyStageName: keyStageName as KeyStageNameValueType,
              keyStageSlug,
              tierName: title,
              useCase,
            });
          }}
        >
          <Heading $ma={16} $font={"heading-7"} tag="h3">
            {title}
          </Heading>
        </OakLink>
      </Flex>
      <Box
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
        $transition={"all 0.4s ease-out"}
        $transform={isHovered ? "translateY(-8px)" : null}
      >
        <Flex
          $ma={16}
          $flexDirection={"column"}
          $font={"body-3"}
          $color={"oakGrey4"}
        >
          <Span $mb={4}>{`${unitCount} units`}</Span>
          <Span $font={"body-3"}>{`${lessonCount} lessons`}</Span>
        </Flex>
      </Box>
      <BoxBorders gapPosition="rightTop" />
    </Card>
  );
};

export default TierListItem;
