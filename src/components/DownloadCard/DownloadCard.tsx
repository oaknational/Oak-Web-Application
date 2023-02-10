import { FC } from "react";
import styled from "styled-components";
import { useHover } from "react-aria";

import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import P from "../Typography/P";
import Flex from "../Flex";
import Checkbox from "../Checkbox";
import Box from "../Box";
import GraphicCircleIcon from "../Icon/GraphicCircleIcon";
import { IconName } from "../Icon";

type ResourceType = "quiz" | "presentation" | "worksheet";

export type DownloadCardProps = {
  id: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  resourceType: ResourceType;
};

type DownloadCardLabelProps = DownloadCardProps & {
  isHovered: boolean;
};

const resourceTypeIconMap = {
  quiz: "Quiz",
  presentation: "Presentation",
  worksheet: "Worksheet",
};

const BoxWithFocusState = styled.div`
  position: relative;
  border: solid 4px transparent;
`;

const DownloadCardLabel: FC<DownloadCardLabelProps> = ({
  isHovered,
  title,
  resourceType,
}) => (
  <BoxWithFocusState>
    <BoxBorders gapPosition="rightTop" />
    <Flex
      $flexDirection="column"
      $alignItems="center"
      $height={220}
      $width={["100%", 200]}
    >
      <Flex $minHeight={110} $pv={16}>
        <GraphicCircleIcon
          icon={resourceTypeIconMap[resourceType] as IconName}
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
          {title}
        </P>
        <P $color={isHovered ? "black" : "oakGrey4"}>PDF</P>
      </Flex>
    </Flex>
  </BoxWithFocusState>
);

const DownloadCard: FC<DownloadCardProps> = (props) => {
  const { checked = false, onChange, id, title } = props;

  const { hoverProps, isHovered } = useHover({});

  return (
    <Box $maxWidth={200} {...hoverProps}>
      <Checkbox
        id={id}
        checked={checked}
        onChange={() => onChange()}
        type={"cardCheckbox"}
        ariaLabel={title}
      >
        <DownloadCardLabel isHovered={isHovered} {...props} />
      </Checkbox>
    </Box>
  );
};

export default DownloadCard;
