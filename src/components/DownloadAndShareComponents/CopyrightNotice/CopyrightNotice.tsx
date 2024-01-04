import { FC } from "react";
import styled from "styled-components";

import P from "@/components/Typography/P";
import OakLink from "@/components/OakLink";
import Box from "@/components/SharedComponents/Box/Box";
import { FontProps } from "@/styles/utils/typography";
import Icon from "@/components/Icon";

type CopyrightNoticeProps = FontProps & {
  showPostAlbCopyright: boolean;
  openLinksExternally: boolean;
};

const ExternalLinkIcon = (props: { openLinksExternally: boolean }) =>
  props.openLinksExternally ? (
    <Icon
      name="external"
      verticalAlign="bottom"
      size={20}
      data-testid="external-link-icon"
    />
  ) : null;

const PreAlbCopyright = (
  props: FontProps & { openLinksExternally: boolean },
) => (
  <P $font="body-3" {...props}>
    This content is made available by Oak National Academy Limited and its
    partners and licensed under Oak’s{" "}
    <OakLink
      page={"legal"}
      legalSlug="terms-and-conditions"
      $isInline
      htmlAnchorProps={{
        target: props.openLinksExternally ? "_blank" : "_self",
        "aria-label": `Terms and conditions${
          props.openLinksExternally ? " (opens in a new tab)" : ""
        }`,
      }}
    >
      terms &amp; conditions{" "}
      <ExternalLinkIcon openLinksExternally={props.openLinksExternally} />
    </OakLink>{" "}
    (Collection 1), except where otherwise stated.
  </P>
);

const StyledLink = styled.a`
  display: inline;
  text-decoration: underline;
  color: ${(props) => props.theme.colors.navy};
`;

const PostAlbCopyright = (
  props: FontProps & { openLinksExternally: boolean },
) => (
  <P $font="body-3" {...props}>
    This content is © Oak National Academy Limited (2023), licensed on{" "}
    <StyledLink
      aria-label={`Open Government License version 3.0${
        props.openLinksExternally ? " (opens in a new tab)" : ""
      }`}
      role="link"
      href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
      target={props.openLinksExternally ? "_blank" : "_self"}
    >
      Open Government Licence version 3.0{" "}
      <ExternalLinkIcon openLinksExternally={props.openLinksExternally} />
    </StyledLink>{" "}
    except where otherwise stated. See{" "}
    <OakLink
      page={"legal"}
      legalSlug="terms-and-conditions"
      $isInline
      htmlAnchorProps={{
        target: props.openLinksExternally ? "_blank" : "_self",
        "aria-label": `Terms and conditions${
          props.openLinksExternally ? " (opens in a new tab)" : ""
        }`,
      }}
    >
      Oak's terms & conditions
      <ExternalLinkIcon openLinksExternally={props.openLinksExternally} />
    </OakLink>{" "}
    (Collection 2).
  </P>
);

const CopyrightNotice: FC<CopyrightNoticeProps> = ({
  showPostAlbCopyright,
  openLinksExternally,
  ...fontProps
}) => (
  <Box $maxWidth={[null, 420, 420]}>
    {showPostAlbCopyright ? (
      <PostAlbCopyright
        {...fontProps}
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
