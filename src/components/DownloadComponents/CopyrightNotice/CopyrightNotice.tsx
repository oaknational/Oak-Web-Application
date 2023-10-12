import { FC } from "react";
import styled from "styled-components";

import P from "@/components/Typography/P";
import OakLink from "@/components/OakLink";
import Box from "@/components/Box/Box";
import { FontProps } from "@/styles/utils/typography";

type CopyrightNoticeProps = FontProps & {
  showPostAlbCopyright: boolean;
  openLinksExternally: boolean;
};

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
      terms &amp; conditions
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
      Open Government Licence version 3.0
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
      Oak's terms &amp; conditions
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
