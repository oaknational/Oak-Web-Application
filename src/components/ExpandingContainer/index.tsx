import React, { FC, useState } from "react";

import Card, { CardProps } from "../Card";
import Flex from "../Flex";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import useClickableCard from "../../hooks/useClickableCard";
import Button from "../Button";
import IconButton from "../Button/IconButton";
import Icon from "../Icon";

type ExpandingContainerProps = CardProps & {
  title: string;
  external?: boolean;
  projectable?: boolean;
  downloadable?: boolean;
};

const ExpandingContainer: FC<ExpandingContainerProps> = ({
  children,
  title,
  external,
  projectable,
  downloadable,
}) => {
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLButtonElement>();
  const [toggleOpen, setToggleOpen] = useState(false);
  return (
    <Card $flexDirection={"column"}>
      <Flex
        $position={"relative"}
        $width={"100%"}
        $maxWidth={"100%"}
        $flexDirection={"column"}
        $dropShadow={isHovered ? "expandableContainerHover" : "subjectCard"}
        $pa={20}
      >
        <Flex>
          {" "}
          <Flex
            {...containerProps}
            $width={"100%"}
            $maxWidth={"100%"}
            $alignItems={"center"}
          >
            <Button
              {...primaryTargetProps}
              variant="minimal"
              label={title}
              onClick={() => setToggleOpen(toggleOpen === false)}
            />
            <Icon
              $color="black"
              name={toggleOpen ? "ChevronDown" : "ChevronUp"}
            />
          </Flex>
          <Flex>
            {downloadable && (
              <IconButton
                $mr={24}
                aria-label="download click me"
                background={"teachersHighlight"}
                icon="Download"
                onClick={() => {
                  console.log("Download Clicked!");
                }}
                variant="brush"
              />
            )}
            {external && (
              <IconButton
                $mr={24}
                aria-label="External click me"
                background={"teachersPastelBlue"}
                icon="External"
                onClick={() => {
                  console.log("External Clicked!");
                }}
                variant="brush"
              />
            )}
            {projectable && (
              <IconButton
                aria-label="Project Click me"
                background={"teachersPastelBlue"}
                icon="Project"
                onClick={() => {
                  console.log("Project Clicked!");
                }}
                variant="brush"
              />
            )}
          </Flex>
        </Flex>
        <BoxBorders gapPosition="rightTop" />
      </Flex>
      <Flex
        $maxHeight={toggleOpen ? 0 : 1600}
        $overflowY={"hidden"}
        $transition={"all 0.3s ease"}
      >
        {children}
      </Flex>
    </Card>
  );
};

export default ExpandingContainer;
