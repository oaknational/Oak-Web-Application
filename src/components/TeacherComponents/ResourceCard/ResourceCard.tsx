import { FC } from "react";
import styled from "styled-components";
import { useHover } from "react-aria";
import { OakP } from "@oaknational/oak-components";

import type { DownloadResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import Checkbox from "@/components/SharedComponents/Checkbox";
import Icon, { IconName } from "@/components/SharedComponents/Icon";
import { CheckboxProps } from "@/components/SharedComponents/Checkbox/Checkbox";
import Radio from "@/components/SharedComponents/RadioButtons/Radio";
import SubjectIcon from "@/components/SharedComponents/SubjectIcon";
import zIndex from "@/styles/utils/zIndex";
import { LessonShareResourceData } from "@/node-lib/curriculum-api-2023/queries/lessonShare/lessonShare.schema";

export type ResourceCardProps = CheckboxProps & {
  label: string;
  resourceType: DownloadResourceType | LessonShareResourceData["type"];
  subtitle: string;
  hasError?: boolean;
  useRadio?: boolean;
  subjectIcon?: string;
  hideCheckbox?: boolean;
};

type ResourceCardLabelProps = ResourceCardProps & {
  isHovered: boolean;
};

const RESOURCE_TYPE_ICON_MAP: Record<
  DownloadResourceType | LessonShareResourceData["type"],
  IconName
> = {
  presentation: "slide-deck",
  "intro-quiz-questions": "quiz",
  "intro-quiz-answers": "quiz",
  "exit-quiz-questions": "quiz",
  "exit-quiz-answers": "quiz",
  "worksheet-pdf": "worksheet",
  "worksheet-pptx": "worksheet",
  "supplementary-pdf": "additional-material",
  "supplementary-docx": "additional-material",
  video: "video",
  "curriculum-pdf": "additional-material",
};

const BoxWithFocusState = styled.div`
  position: relative;
  display: flex;
  flex-direction: "row";
  width: 100%;
`;

const RadioContainer = styled.div`
  z-index: 1;
  width: 100%;
  label > div {
    width: 100%;
    overflow: auto;
    p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: calc(100% - 36px);
    }
  }
  label > span {
    position: absolute;
    right: 10px;
    top: calc(50% - 10px);
    ${zIndex}
  }
`;

const ResourceCardLabel: FC<ResourceCardLabelProps> = ({
  isHovered,
  resourceType,
  label,
  subtitle,
  subjectIcon,
}) => {
  return (
    <BoxWithFocusState>
      <Flex
        $alignItems={"center"}
        $justifyContent={"center"}
        $pa={6}
        $background={"lemon"}
        $width={66}
      >
        {resourceType == "curriculum-pdf" && subjectIcon ? (
          <SubjectIcon
            subjectSlug={subjectIcon}
            $display={"flex"}
            $minWidth={50}
            $minHeight={50}
            $objectPosition={"center"}
          />
        ) : (
          <Icon
            name={RESOURCE_TYPE_ICON_MAP[resourceType]}
            $display={"flex"}
            $pa={8}
            height={50}
            $width={50}
            $objectPosition={"center"}
          />
        )}
      </Flex>

      <BoxBorders gapPosition="rightTop" />
      <Flex
        $flexDirection="column"
        $alignItems="center"
        $width={["100%"]}
        $maxWidth={320}
        $background={isHovered ? "grey20" : "white"}
        $overflow="hidden"
      >
        <Flex
          $flexDirection="column"
          $justifyContent="center"
          $ph={16}
          $pv={16}
          $width="100%"
        >
          <OakP
            $font="heading-7"
            $mb="space-between-sssx"
            $textDecoration={isHovered ? "underline" : "none"}
          >
            {label}
          </OakP>
          <OakP $color="grey60">{subtitle}</OakP>
        </Flex>
      </Flex>
    </BoxWithFocusState>
  );
};

const ResourceCard: FC<ResourceCardProps> = (props) => {
  const {
    checked = false,
    onChange,
    id,
    name,
    label,
    subtitle,
    onBlur,
    hasError = false,
    useRadio = false,
    hideCheckbox = false,
  } = props;

  const { hoverProps, isHovered } = useHover({});

  return (
    <Flex
      $maxHeight={72}
      $width={320}
      $position={"relative"}
      {...hoverProps}
      data-testid="resourceCard"
    >
      {useRadio ? (
        <RadioContainer $zIndex={"inFront"}>
          <Radio id={id} value={id} aria-label={label}>
            <ResourceCardLabel isHovered={isHovered} {...props} />
          </Radio>
        </RadioContainer>
      ) : !hideCheckbox ? (
        <Checkbox
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          variant={"withoutLabel"}
          slim={true}
          ariaLabel={`${label} ${
            subtitle === "PPTX" ? "powerpoint" : subtitle
          }`}
          onBlur={onBlur}
          hasError={hasError}
        >
          <ResourceCardLabel isHovered={isHovered} {...props} />
        </Checkbox>
      ) : (
        <ResourceCardLabel isHovered={false} {...props} />
      )}
    </Flex>
  );
};

export default ResourceCard;
