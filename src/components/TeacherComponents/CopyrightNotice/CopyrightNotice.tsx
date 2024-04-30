import { FC } from "react";
import styled from "styled-components";
import { OakP } from "@oaknational/oak-components";

import OwaLink from "@/components/SharedComponents/OwaLink";
import Box from "@/components/SharedComponents/Box";
import { FontProps } from "@/styles/utils/typography";
import Icon from "@/components/SharedComponents/Icon";

type CopyrightNoticeProps = FontProps & {
  showPostAlbCopyright: boolean;
  openLinksExternally: boolean;
  updatedAt?: string;
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
  <OakP $font="body-3" {...props}>
    This content is made available by Oak National Academy Limited and its
    partners and licensed under Oak’s{" "}
    <OwaLink
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
  props: FontProps & { openLinksExternally: boolean; updatedAt?: string },
) => {
  let currentYear;
  if (props.updatedAt) {
    currentYear = new Date(props.updatedAt).getFullYear();
  } else {
    currentYear = "2023";
  }
  return (
    <OakP $font="body-3" {...props}>
      This content is © Oak National Academy Limited ({currentYear}), licensed
      on{" "}
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
      <OwaLink
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
      </OwaLink>{" "}
      (Collection 2).
    </OakP>
  );
};

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
