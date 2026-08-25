import React, { ReactElement } from "react";
import styled from "styled-components";
import {
  OakFlex,
  OakP,
  OakHeading,
  OakBox,
  OakImage,
  OakMaxWidth,
  OakIcon,
} from "@oaknational/oak-components";

export type HeaderHeroProps = {
  authorImageSrc?: string;
  authorImageAlt?: string;
  authorName?: string;
  authorTitle?: string;
  heroImageSrc: string;
  heroImageAlt: string;
  headingTitle?: string;
  subHeadingText: string;
  breadcrumbs: ReactElement;
  cmsImage?: ReactElement;
};

const StyledAuthorImage = styled(OakImage)`
  width: 50px;
  height: 50px;
  margin-right: 12px;
  img {
    border-radius: 50%;
  }
`;

/**
 *
 * Oak Heading component with hero image, can be used for blog posts, articles, and other content pages.
 *
 * This Oak component can be passed the OWA breadcrumbs component as a prop. Currently this component does not exist in the component library.
 */
export const HeaderHero = (props: HeaderHeroProps) => {
  const {
    authorName,
    authorTitle,
    authorImageSrc,
    authorImageAlt,
    heroImageSrc,
    heroImageAlt,
    headingTitle,
    breadcrumbs,
    subHeadingText,
    cmsImage,
  } = props;

  const hasAuthorProps =
    authorImageSrc && authorImageAlt && authorName && authorTitle;

  return (
    <OakBox
      $width={"100%"}
      $background={"bg-decorative3-main"}
      $overflowX={"hidden"}
    >
      <OakMaxWidth>
        <OakFlex
          $minWidth={"100%"}
          $flexDirection={["column-reverse", "column-reverse", "row"]}
          $alignItems={["center", null]}
          $minHeight={"spacing-360"}
          $background={"bg-decorative3-main"}
          $zIndex={"neutral"}
          $justifyContent={["space-between"]}
          data-testid="oak-header-component"
        >
          <OakFlex
            $alignSelf={"flex-start"}
            $height={"100%"}
            $flexDirection={"column"}
          >
            <OakBox $display={["none", "none", "block"]} $pv={"spacing-24"}>
              {breadcrumbs}
            </OakBox>
            <OakFlex
              $flexDirection={"column"}
              $maxWidth={"spacing-640"}
              $minHeight={["spacing-0", "spacing-0", "spacing-360"]}
              $mb={["spacing-0", "spacing-48", "spacing-0"]}
              $justifyContent={"center"}
            >
              <OakHeading
                tag="h1"
                $color={"text-primary"}
                $font={["heading-4", "heading-3"]}
                $mb={"spacing-24"}
              >
                {headingTitle}
              </OakHeading>
              {hasAuthorProps && (
                <OakFlex
                  $mb={"spacing-24"}
                  $flexDirection={"row"}
                  $alignItems={"center"}
                >
                  <StyledAuthorImage
                    alt={authorImageAlt}
                    src={authorImageSrc}
                    $zIndex={"in-front"}
                  />
                  <OakBox>
                    <OakP $font={"heading-7"}>{authorName}</OakP>
                    <OakP $font={"body-3"}>{authorTitle}</OakP>
                  </OakBox>
                </OakFlex>
              )}
              <OakP $font={"body-1"} $mb={["spacing-48", "spacing-0"]}>
                {subHeadingText}
              </OakP>
            </OakFlex>
          </OakFlex>

          <OakFlex
            $position={"relative"}
            $minHeight={["spacing-180", "spacing-480", "spacing-480"]}
            $alignItems={"center"}
            $justifyContent={"center"}
            $mb={["spacing-0", "spacing-32", "spacing-0"]}
          >
            {cmsImage ? (
              cmsImage
            ) : (
              <OakImage
                $transform={"rotate(-2.025deg)"}
                src={heroImageSrc}
                width={100}
                $minHeight={["spacing-240", "spacing-360", "spacing-360"]}
                $minWidth={["spacing-240", "spacing-640", "spacing-480"]}
                alt={heroImageAlt}
                $zIndex={"in-front"}
              />
            )}
            <OakFlex
              $position={"absolute"}
              $top={"spacing-0"}
              $bottom={"spacing-0"}
              $width={["spacing-360", "spacing-960", "spacing-960"]}
            >
              <OakIcon
                iconName="loopdown"
                alt="loopdown ui-graphic"
                $position={"absolute"}
                $height={"100%"}
                $width={"100%"}
              />
            </OakFlex>
          </OakFlex>
          <OakFlex
            $alignSelf={"flex-start"}
            $ml={"spacing-24"}
            $pt={"spacing-24"}
            $pb={[null, "spacing-24"]}
            $display={["block", "block", "none"]}
          >
            {breadcrumbs}
          </OakFlex>
        </OakFlex>
      </OakMaxWidth>
    </OakBox>
  );
};
