import { FC } from "react";
import styled from "styled-components";
import { useHover } from "react-aria";

import type { DownloadResourceType } from "../downloads.types";

import { RESOURCE_TYPE_ICON_MAP } from "@/components/DownloadComponents/DownloadCard/DownloadCard";
import BoxBorders from "@/components/SpriteSheet/BrushSvgs/BoxBorders";
import P from "@/components/Typography/P";
import Flex from "@/components/Flex";
import Checkbox from "@/components/Checkbox";
import Icon from "@/components/Icon";
import { CheckboxProps } from "@/components/Checkbox/Checkbox";

export type DownloadCardProps = CheckboxProps & {
  label: string;
  resourceType: DownloadResourceType;
  extension: string;
  hasError?: boolean;
};

type DownloadCardLabelProps = DownloadCardProps & {
  isHovered: boolean;
};

const BoxWithFocusState = styled.div`
  position: relative;
  border: solid 4px transparent;
  display: flex;
  flex-direction: "row";
`;

const DownloadCardLabel: FC<DownloadCardLabelProps> = ({
  isHovered,
  resourceType,
  label,
  extension,
}) => {
  return (
    <BoxWithFocusState>
      <Flex
        $alignItems={"center"}
        $justifyContent={"center"}
        $pa={8}
        $background={"teachersYellow"}
        $width={66}
      >
        <Icon
          name={RESOURCE_TYPE_ICON_MAP[resourceType]}
          $display={"flex"}
          $pa={8}
          height={50}
          $width={50}
          $objectPosition={"center"}
        />
      </Flex>

      <BoxBorders gapPosition="rightTop" />
      <Flex
        $flexDirection="column"
        $alignItems="center"
        $width={["100%"]}
        $maxWidth={320}
        $background={isHovered ? "grey1" : "white"}
        $zIndex={"behind"}
      >
        <Flex
          $flexDirection="column"
          $justifyContent="center"
          $ph={16}
          $pv={16}
          $width="100%"
        >
          <P
            $font="heading-7"
            $mb={4}
            $textDecoration={isHovered ? "underline" : "none"}
          >
            {label}
          </P>
          <P $color="oakGrey4">{extension.toUpperCase()}</P>
        </Flex>
      </Flex>
    </BoxWithFocusState>
  );
};

const DownloadCard: FC<DownloadCardProps> = (props) => {
  const {
    checked = false,
    onChange,
    id,
    name,
    label,
    onBlur,
    hasError = false,
  } = props;

  const { hoverProps, isHovered } = useHover({});

  return (
    <Flex
      $minWidth={320}
      $maxHeight={72}
      $width={"fit-content"}
      $position={"relative"}
      {...hoverProps}
    >
      <Checkbox
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        variant={"withoutLabel"}
        slim={true}
        ariaLabel={label}
        onBlur={onBlur}
        hasError={hasError}
      >
        <DownloadCardLabel isHovered={isHovered} {...props} />
      </Checkbox>
    </Flex>
  );
};

export default DownloadCard;
