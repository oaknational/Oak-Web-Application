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

type ResourceType = "exit_quiz" | "slides" | "worksheet" | "worksheet::text";

export type DownloadCardProps = {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  resourceType: ResourceType;
};

type DownloadCardLabelProps = DownloadCardProps & {
  isHovered: boolean;
};

export const RESOURCE_TITLE_AND_ICON = {
  exit_quiz: { title: "Exit quiz", icon: "Quiz" },
  slides: { title: "Slide deck", icon: "Slidedeck" },
  worksheet: { title: "Worksheet", icon: "Worksheet" },
  "worksheet::text": {
    title: "Worksheet (black and white)",
    icon: "Worksheet",
  },
};

export const getResourceTitleByType = (type: ResourceType) => {
  const currentResource = RESOURCE_TITLE_AND_ICON[type];
  return currentResource ? currentResource.title : "Download";
};

export const getResourceIconByType = (type: ResourceType) => {
  const currentResource = RESOURCE_TITLE_AND_ICON[type];
  return currentResource ? currentResource.icon : "Download";
};

const BoxWithFocusState = styled.div`
  position: relative;
  border: solid 4px transparent;
`;

const DownloadCardLabel: FC<DownloadCardLabelProps> = ({
  isHovered,
  resourceType,
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
          icon={getResourceIconByType(resourceType) as IconName}
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
          {getResourceTitleByType(resourceType)}
        </P>
        <P $color={isHovered ? "black" : "oakGrey4"}>PDF</P>
      </Flex>
    </Flex>
  </BoxWithFocusState>
);

const DownloadCard: FC<DownloadCardProps> = (props) => {
  const { checked = false, onChange, id, name, resourceType } = props;
  const title = getResourceTitleByType(resourceType);

  const { hoverProps, isHovered } = useHover({});

  return (
    <Box $maxWidth={200} {...hoverProps}>
      <Checkbox
        id={id}
        name={name}
        checked={checked}
        onChange={() => onChange()}
        variant={"cardCheckbox"}
        ariaLabel={title}
      >
        <DownloadCardLabel isHovered={isHovered} {...props} />
      </Checkbox>
    </Box>
  );
};

export default DownloadCard;
