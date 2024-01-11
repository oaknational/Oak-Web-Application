import React, { FC, useState } from "react";

import { containerTitleToPreselectMap } from "@/components/DownloadAndShareComponents/helpers/containerTitleToPreselectMap";
import Icon from "@/components/SharedComponents/Icon";
import Card, { CardProps } from "@/components/SharedComponents/Card";
import IconButton from "@/components/SharedComponents/Button/IconButton";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import IconButtonAsLink from "@/components/SharedComponents/Button/IconButtonAsLink";
import Button from "@/components/SharedComponents/Button";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import useClickableCard from "@/hooks/useClickableCard";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";

export type ExpandingContainerTitle =
  | "Slide deck"
  | "Exit quiz"
  | "Starter quiz"
  | "Worksheet"
  | "Video"
  | "Transcript"
  | "Lesson overview"
  | "Additional material";

type ExpandingContainerProps = CardProps & {
  title: ExpandingContainerTitle;
  external?: boolean;
  projectable?: boolean;
  downloadable?: boolean;
  toggleClosed?: boolean;
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
  onDownloadButtonClick?: () => void;
};

const ExpandingContainer: FC<ExpandingContainerProps> = ({
  children,
  title,
  external,
  projectable,
  downloadable,
  toggleClosed = true,
  onDownloadButtonClick,
  ...props
}) => {
  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLButtonElement>();
  const [toggleOpen, setToggleOpen] = useState(toggleClosed);
  const lowerCaseTitle = title.toLowerCase();

  const getPreselectedQueryFromTitle = (title: ExpandingContainerTitle) => {
    return containerTitleToPreselectMap[title];
  };
  const preselected = getPreselectedQueryFromTitle(title)?.downloadType;

  const { track } = useAnalytics();
  const { analyticsUseCase, pageName } = useAnalyticsPageProps();

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
                aria-expanded={!toggleOpen}
                label={title}
                onClick={() => {
                  setToggleOpen(!toggleOpen);
                  if (toggleOpen) {
                    track.resourceContainerExpanded({
                      analyticsUseCase,
                      pageName,
                      containerTitle: title,
                    });
                  }
                }}
                $font={"heading-5"}
              />
              <Icon
                $color="black"
                name={toggleOpen ? "chevron-down" : "chevron-up"}
              />
            </Flex>
          </Card>
          <Flex>
            {downloadable === true && (
              <>
                <Box $display={["none", "block"]}>
                  <ButtonAsLink
                    data-testid={"download-button"}
                    variant={"minimal"}
                    page={"lesson-downloads"}
                    aria-label={`download ${lowerCaseTitle}`}
                    iconBackground="blue"
                    icon="download"
                    $iconPosition="trailing"
                    label={`Download ${lowerCaseTitle}`}
                    onClick={() => {
                      if (onDownloadButtonClick) {
                        onDownloadButtonClick();
                      }
                    }}
                    query={{
                      preselected: preselected,
                    }}
                    {...props}
                  />
                </Box>
                <Box $display={["block", "none"]}>
                  <IconButtonAsLink
                    data-testid={"download-button-mobile"}
                    page={"lesson-downloads"}
                    aria-label={`download ${lowerCaseTitle}`}
                    background={"blue"}
                    icon="download"
                    variant="brush"
                    query={{
                      preselected: preselected,
                    }}
                    {...props}
                  />
                </Box>
              </>
            )}
            {external === true && (
              <IconButton
                data-testid={"external-button"}
                $ml={24}
                aria-label="External click me"
                background={"lavender"}
                icon="external"
                onClick={() => {
                  // console.log("External Clicked!");
                }}
                variant="brush"
              />
            )}
            {projectable === true && (
              <IconButton
                $ml={24}
                data-testid={"project-button"}
                aria-label="Project Click me"
                background={"lavender"}
                icon="project"
                onClick={() => {
                  // console.log("Project Clicked!");
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
        $visibility={toggleOpen ? "hidden" : "visible"}
      >
        {children}
      </Flex>
    </Card>
  );
};

export default ExpandingContainer;
