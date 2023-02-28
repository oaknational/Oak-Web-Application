import { FC } from "react";
import styled from "styled-components";
import { useHover } from "react-aria";

import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders";
import P from "../../Typography/P";
import Flex from "../../Flex";
import Checkbox from "../../Checkbox";
import Box from "../../Box";
import GraphicCircleIcon from "../../Icon/GraphicCircleIcon";
import { IconName } from "../../Icon";
import type { DownloadResourceType } from "../downloads.types";

export type DownloadCardProps = {
  id: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  resourceType: DownloadResourceType;
  extension: string;
};

type DownloadCardLabelProps = DownloadCardProps & {
  isHovered: boolean;
};

export const RESOURCE_TYPE_ICON_MAP: Record<DownloadResourceType, IconName> = {
  presentation: "slide-deck",
  "intro-quiz-questions": "quiz",
  "intro-quiz-answers": "quiz",
  "exit-quiz-questions": "quiz",
  "exit-quiz-answers": "quiz",
  "worksheet-pdf": "worksheet",
  "worksheet-pptx": "worksheet",
};

const BoxWithFocusState = styled.div`
  position: relative;
  border: solid 4px transparent;
`;

const DownloadCardLabel: FC<DownloadCardLabelProps> = ({
  isHovered,
  resourceType,
  label,
  extension,
}) => (
  <BoxWithFocusState>
    <BoxBorders gapPosition="rightTop" />
    <Flex
      $flexDirection="column"
      $alignItems="center"
      $height={220}
      $width={["100%"]}
      $maxWidth={200}
    >
      <Flex $minHeight={110} $pv={16}>
        <GraphicCircleIcon
          icon={RESOURCE_TYPE_ICON_MAP[resourceType]}
          hasDropShadow={false}
          isHovered={isHovered}
        />
      </Flex>
      <Flex
        $flexDirection="column"
        $alignItems="center"
        $transform={isHovered ? "translateY(-8px)" : null}
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
        $transition={"all 0.3s ease"}
        $minHeight={110}
        $ph={8}
        $width={"100%"}
        $textAlign={"center"}
      >
        <P $font="heading-7" $mt={36} $mb={4}>
          {label}
        </P>
        <P $color={isHovered ? "black" : "oakGrey4"}>
          {extension.toUpperCase()}
        </P>
      </Flex>
    </Flex>
  </BoxWithFocusState>
);

const DownloadCard: FC<DownloadCardProps> = (props) => {
  const { checked = false, onChange, id, name, label } = props;

  const { hoverProps, isHovered } = useHover({});

  return (
    <Box $maxWidth={200} {...hoverProps}>
      <Checkbox
        id={id}
        name={name}
        checked={checked}
        onChange={() => onChange()}
        variant={"cardCheckbox"}
        ariaLabel={label}
      >
        <DownloadCardLabel isHovered={isHovered} {...props} />
      </Checkbox>
    </Box>
  );
};

export default DownloadCard;
