import { FC } from "react";
import styled from "styled-components";
import { OakP, OakIcon, OakFlex } from "@oaknational/oak-components";

import OwaLink from "@/components/SharedComponents/OwaLink";
import Box from "@/components/SharedComponents/Box";
import { FontProps } from "@/styles/utils/typography";

type CopyrightNoticeProps = FontProps & {
  showPostAlbCopyright: boolean;
  openLinksExternally: boolean;
  copyrightYear: string;
  fullWidth?: boolean;
};

const ExternalLinkIcon = (props: { openLinksExternally: boolean }) =>
  props.openLinksExternally ? (
    <OakIcon
      iconName="external"
      $width={"all-spacing-5"}
      $height={"all-spacing-5"}
      $display={"inline-flex"}
      data-testid="external-link-icon"
      $colorFilter={"navy"}
    />
  ) : null;

const PreAlbCopyright = (
  props: FontProps & { openLinksExternally: boolean },
) => (
  <OakP $font="body-3" {...props}>
    This content is made available by Oak National Academy Limited and its
    partners and licensed under Oak’s{" "}
    <OwaLink
      page={"legal"}
      legalSlug="terms-and-conditions"
      htmlAnchorProps={{
        target: props.openLinksExternally ? "_blank" : "_self",
        "aria-label": `Terms and conditions${
          props.openLinksExternally ? " (opens in a new tab)" : ""
        }`,
      }}
      $display={"inline-flex"}
      $alignItems={"center"}
    >
      terms &amp; conditions{" "}
      <ExternalLinkIcon openLinksExternally={props.openLinksExternally} />
    </OwaLink>{" "}
    (Collection 1), except where otherwise stated.
  </OakP>
);

const StyledLink = styled.a`
  display: inline;
  text-decoration: underline;
  color: ${(props) => props.theme.colors.navy};
`;

const PostAlbCopyright = (
  props: FontProps & { openLinksExternally: boolean; copyrightYear: string },
) => {
  const { copyrightYear } = props;
  const year = new Date(copyrightYear).getFullYear();
  return (
    <OakP $font="body-3" {...props}>
      This content is © Oak National Academy Limited ({year}), licensed on{" "}
      <StyledLink
        aria-label={`Open Government License version 3.0${
          props.openLinksExternally ? " (opens in a new tab)" : ""
        }`}
        role="link"
        href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
        target={props.openLinksExternally ? "_blank" : "_self"}
      >
        <OakFlex
          $display={"inline-flex"}
          $alignItems={"center"}
          $textDecoration={"underline"}
        >
          Open Government Licence version 3.0{" "}
          <ExternalLinkIcon openLinksExternally={props.openLinksExternally} />
        </OakFlex>
      </StyledLink>{" "}
      except where otherwise stated. See{" "}
      <OwaLink
        page={"legal"}
        legalSlug="terms-and-conditions"
        htmlAnchorProps={{
          target: props.openLinksExternally ? "_blank" : "_self",
          "aria-label": `Terms and conditions${
            props.openLinksExternally ? " (opens in a new tab)" : ""
          }`,
        }}
        $color={"navy"}
        $display={"inline-flex"}
        $textDecoration={"underline"}
      >
        Oak's terms & conditions
        <ExternalLinkIcon openLinksExternally={props.openLinksExternally} />
      </OwaLink>{" "}
      (Collection 2).
    </OakP>
  );
};

const CopyrightNotice: FC<CopyrightNoticeProps> = ({
  showPostAlbCopyright,
  openLinksExternally,
  copyrightYear,
  fullWidth,
  ...fontProps
}) => (
  <Box $maxWidth={fullWidth ? null : [null, 420, 420]}>
    {showPostAlbCopyright ? (
      <PostAlbCopyright
        {...fontProps}
        copyrightYear={copyrightYear}
        openLinksExternally={openLinksExternally}
      />
    ) : (
      <PreAlbCopyright
        {...fontProps}
        openLinksExternally={openLinksExternally}
      />
    )}
  </Box>
);

export default CopyrightNotice;
