import React, { FC, useState } from "react";

import Card, { CardProps } from "../Card";
import Flex from "../Flex";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import useClickableCard from "../../hooks/useClickableCard";
import Button from "../Button";
import IconButton from "../Button/IconButton";
import IconButtonAsLink from "../Button/IconButtonAsLink";
import Icon from "../Icon";

type ExpandingContainerProps = CardProps & {
  title: string;
  external?: boolean;
  projectable?: boolean;
  downloadable?: boolean;
  downloadLink?: string;
  toggleClosed?: boolean;
};

const ExpandingContainer: FC<ExpandingContainerProps> = ({
  children,
  title,
  external,
  projectable,
  downloadable,
  downloadLink,
  toggleClosed = true,
}) => {
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLButtonElement>();
  const [toggleOpen, setToggleOpen] = useState(toggleClosed);
  return (
    <Card $flexDirection={"column"} $ph={0} $pv={20}>
      <Flex
        $position={"relative"}
        $width={"100%"}
        $maxWidth={"100%"}
        $flexDirection={"column"}
        $dropShadow={isHovered ? "expandableContainerHover" : "subjectCard"}
        $pa={20}
      >
        <Flex $justifyContent={"space-between"}>
          <Card $pa={0} {...containerProps} $flexGrow={0}>
            <Flex $position="relative" $alignItems={"center"}>
              <Button
                {...primaryTargetProps}
                data-testid={"expand-button"}
                variant="minimal"
                label={title}
                onClick={() => setToggleOpen(toggleOpen === false)}
                $font={"heading-5"}
              />
              <Icon
                $color="black"
                name={toggleOpen ? "chevron-down" : "chevron-up"}
              />
            </Flex>
          </Card>
          <Flex>
            {downloadable === true && downloadLink && (
              <IconButtonAsLink
                data-testid={"download-button"}
                href={downloadLink}
                page={null}
                aria-label="download resource"
                background={"teachersHighlight"}
                icon="download"
                variant="brush"
              />
            )}
            {external === true && (
              <IconButton
                data-testid={"external-button"}
                $ml={24}
                aria-label="External click me"
                background={"teachersPastelBlue"}
                icon="external"
                onClick={() => {
                  console.log("External Clicked!");
                }}
                variant="brush"
              />
            )}
            {projectable === true && (
              <IconButton
                $ml={24}
                data-testid={"project-button"}
                aria-label="Project Click me"
                background={"teachersPastelBlue"}
                icon="project"
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
        data-testid={"expanded-container"}
        $maxHeight={toggleOpen ? 0 : 9600}
        $overflowY={"hidden"}
        $transition={"all 0.3s ease"}
      >
        {children}
      </Flex>
    </Card>
  );
};

export default ExpandingContainer;
