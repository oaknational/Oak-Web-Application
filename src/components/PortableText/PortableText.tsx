import React, { FC } from "react";
import Link from "next/link";
import {
  PortableTextComponents,
  PortableTextComponentsProvider,
  PortableTextMarkComponent,
} from "@portabletext/react";
import styled from "styled-components";

import errorReporter from "../../common-lib/error-reporter";
import { resolveInternalHref } from "../../utils/portableText/resolveInternalHref";
import { CTAInternalLinkEntry } from "../../node-lib/cms/sanity-client/schemas";
import { LI, OL, P, Span } from "../Typography";

const reportError = errorReporter("PortableText");

export const PTInternalLink: PortableTextMarkComponent<{
  _type: "internalLink";
  reference?: CTAInternalLinkEntry;
}> = (props) => {
  if (!props.value?.reference) {
    console.warn("Unable to render internal link for props:", props);
    return null;
  }

  let href;
  try {
    href = resolveInternalHref(props.value.reference);
  } catch (err) {
    reportError(err, { severity: "warning" });
    console.warn("Unable to render internal link for props:", props);
  }

  if (!href) {
    return null;
  }
  return (
    <Span $color={"hyperlink"}>
      <Link href={href}>
        <a>{props.children}</a>
      </Link>
    </Span>
  );
};

export const PTExternalLink: PortableTextMarkComponent<{
  _type: "link";
  href: string;
}> = (props) => {
  if (!props.value?.href) {
    return null;
  }

  const { href } = props.value;

  return (
    <Span $color={"hyperlink"}>
      <Link href={href}>
        <a>{props.children}</a>
      </Link>
    </Span>
  );
};

const BodyP = styled(P)`
  &:first-child {
    margin-top: 0;
  }
`;

export const basePortableTextComponents: PortableTextComponents = {
  block: {
    normal: (props) => {
      return (
        <BodyP $font={["body-2", "body-1"]} $mt={[16, 20]}>
          {props.children}
        </BodyP>
      );
    },
  },
  list: {
    bullet: (props) => <ul>{props.children}</ul>,
    number: (props) => <OL $ml={[16, 28]}>{props.children}</OL>,
  },
  listItem: {
    bullet: (props) => (
      <LI $font={["list-item-2", "list-item-1"]}>{props.children}</LI>
    ),
    number: (props) => (
      <LI $font={["list-item-2", "list-item-1"]}>{props.children}</LI>
    ),
  },
  marks: {
    strong: (props) => {
      return <Span as="strong">{props.children}</Span>;
    },
    em: (props) => {
      return <Span as="em">{props.children}</Span>;
    },
    internalLink: PTInternalLink,
    link: PTExternalLink,
  },
};

export const BasePortableTextProvider: FC = (props) => {
  return (
    <PortableTextComponentsProvider components={basePortableTextComponents}>
      {props.children}
    </PortableTextComponentsProvider>
  );
};
