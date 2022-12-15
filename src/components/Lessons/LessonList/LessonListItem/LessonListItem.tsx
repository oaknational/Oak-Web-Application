import { FC } from "react";

import useClickableCard from "../../../../hooks/useClickableCard";
import Flex from "../../../Flex";
import Icon from "../../../Icon";
import { Heading, Span } from "../../../Typography";
import BoxBorders from "../../../SpriteSheet/BrushSvgs/BoxBorders";
import Card from "../../../Card";
import OakLink from "../../../OakLink";
import LineClamp from "../../../LineClamp";
import LessonResourceGraphics from "../../../LessonResourceGraphics";

export type LessonListItemProps = {
  title: string;
  description: string;
  slug: string;
  keyStageSlug: string;
  subjectSlug: string;
  quizCount: number | null;
  videoCount: number | null;
  presentationCount: number | null;
  worksheetCount: number | null;
};

/**
 * Contains a lesson title, description, icon, and icons for resources
 * Links to a lesson-index page
 */
const LessonListItem: FC<LessonListItemProps> = (props) => {
  const {
    title,
    subjectSlug,
    slug,
    keyStageSlug,
    description,
    quizCount,
    videoCount,
    presentationCount,
    worksheetCount,
  } = props;

  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();

  const resources = [
    { title: "presentation", href: "/", resourceCount: presentationCount || 0 },
    { title: "worksheet", href: "/", resourceCount: worksheetCount || 0 },
    { title: "quiz", href: "/", resourceCount: quizCount || 0 },
    { title: "video", href: "/", resourceCount: videoCount || 0 },
  ];

  return (
    <Card
      $justifyContent={"space-between"}
      $flexDirection={"row"}
      $mb={16}
      $overflow={"hidden"}
      {...containerProps}
      $pa={0}
    >
      <Flex
        $transform={isHovered ? "translateY(-4px)" : null}
        $transition={"all 0.4s ease-out"}
        $width={"100%"}
        $position={"relative"}
        $flexDirection={"row"}
        $justifyContent={"space-between"}
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
        $alignItems={"center"}
      >
        <Flex
          $ml={[16, 24]}
          $mr={[0, 24]}
          $flexDirection={"column"}
          $width={"100%"}
        >
          <OakLink
            keyStage={keyStageSlug}
            subject={subjectSlug}
            slug={slug}
            page={"lesson-index"}
            {...primaryTargetProps}
          >
            <Flex>
              <Heading
                $mt={24}
                $mb={12}
                $font={["heading-7", "heading-6"]}
                tag={"h3"}
              >
                {title}
              </Heading>
              <Flex
                $justifyContent={"center"}
                $display={["flex", "none"]}
                $alignItems={"center"}
                $minHeight={72}
                $minWidth={72}
                $background={"teachersLilac"}
                $position={"relative"}
                $ml={"auto"}
              >
                <Icon size={[50, 92]} name={"Rocket"}>
                  {title}
                </Icon>
              </Flex>
            </Flex>
          </OakLink>
          <Flex $display={["none", "flex"]} $mb={24}>
            <LineClamp lines={2}>
              <Span $font={"body-2"} $color={"oakGrey5"}>
                {description}
              </Span>
            </LineClamp>
          </Flex>
          <Flex $display={["flex", "none"]} $mt={8} $mb={24} $mr={16}>
            <LineClamp lines={5}>
              <Span $font={"body-2"} $color={"oakGrey5"}>
                {description}
              </Span>
            </LineClamp>
          </Flex>
          <LessonResourceGraphics items={resources} />
        </Flex>
      </Flex>
      <Flex
        $justifyContent={"center"}
        $display={["none", "flex"]}
        $alignItems={"center"}
        $minHeight={110}
        $minWidth={130}
        $background={"teachersLilac"}
        $position={"relative"}
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
        $transform={isHovered ? "translateY(-4px)" : null}
        $transition={"all 0.4s ease-out"}
      >
        <Icon size={[50, 92]} name={"Rocket"}>
          {title}
        </Icon>
      </Flex>
      <BoxBorders gapPosition="bottomRight" />
    </Card>
  );
};

export default LessonListItem;
