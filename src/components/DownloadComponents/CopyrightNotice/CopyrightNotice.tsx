import { FC } from "react";
import styled from "styled-components";

import P from "@/components/Typography/P";
import OakLink from "@/components/OakLink";
import Box from "@/components/Box/Box";
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
    This content is made available by Oak and its partners and licensed under
    Oak’s{" "}
    <OakLink
      page={"legal"}
      legalSlug="terms-and-conditions"
      $isInline
      htmlAnchorProps={{
        target: props.openLinksExternally ? "_blank" : "_self",
      }}
    >
      terms &amp; conditions{" "}
      <ExternalLinkIcon openLinksExternally={props.openLinksExternally} />
    </OakLink>
    , except where otherwise stated.
  </P>
);

const StyledLink = styled.a`
  display: inline;
  text-decoration: underline;
  color: ${(props) => props.theme.colors.hyperlink};
`;

const PostAlbCopyright = (
  props: FontProps & { openLinksExternally: boolean },
) => (
  <P $font="body-3" {...props}>
    This content is © Oak National Academy (2023), licensed on{" "}
    <StyledLink
      aria-label={"Open Government License version 3.0"}
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
      }}
    >
      Oak's terms &amp; conditions{" "}
      <ExternalLinkIcon openLinksExternally={props.openLinksExternally} />
    </OakLink>
    .
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
