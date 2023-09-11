import React, { FC } from "react";
import {
  PortableTextComponents,
  PortableTextComponentsProvider,
  PortableTextMarkComponent,
} from "@portabletext/react";
import styled from "styled-components";

import errorReporter from "../../common-lib/error-reporter";
import { resolveInternalHref } from "../../utils/portableText/resolveInternalHref";
import { CTAInternalLinkEntry } from "../../common-lib/cms-types";
import { LI, OL, P, Span } from "../Typography";
import OakLink from "../OakLink";
import getProxiedSanityAssetUrl from "../../common-lib/urls/getProxiedSanityAssetUrl";
import AnchorTarget from "../AnchorTarget";
import Box from "../Box";

import { PTActionTrigger } from "./PTActionTrigger";

const reportError = errorReporter("PortableText");

type UnresolvedReference = {
  _ref: string;
  _type: "reference";
};

const isUnresolvedReference = (x: unknown): x is UnresolvedReference =>
  Boolean(x) &&
  x !== null &&
  typeof x === "object" &&
  !("contentType" in x) &&
  "_ref" in x;

/**
 * This component expects to receive a "resolved" portable text reference,
 * e.g.
 *    { contentType: 'webinar', slug: 'some-webinar' }
 * instead of
 *    { _type: 'reference', _ref: '9c0bbd19-ffca-4c29-b60f-368a34abaacb' }
 *
 * The resolving happens at the CMS client layer, after fetching but
 * before parsing, see sanity-client/resolveSanityReferences.ts
 */
export const PTInternalLink: PortableTextMarkComponent<{
  _type: "internalLink";
  reference?: CTAInternalLinkEntry | UnresolvedReference;
}> = (props) => {
  const reference = props.value?.reference;

  if (!reference) {
    console.warn(
      "Unable to render PTInternalLink (missing reference), props:",
      props,
    );
    return null;
  }

  if (isUnresolvedReference(reference)) {
    reportError(
      new Error("Encountered un-resolved reference within portable text"),
      { severity: "warning", internalReference: reference },
    );
    console.warn(
      "Unable to render PTInternalLink (un-resolved reference), props:",
      props,
    );

    return null;
  }

  let href: string | undefined;
  try {
    href = resolveInternalHref(reference);
  } catch (err) {
    reportError(err, { severity: "warning", internalReference: reference });
    console.warn("Unable to render PTInternalLink, props:", props);
  }

  if (!href) {
    return null;
  }

  href = getProxiedSanityAssetUrl(href);

  return (
    <OakLink href={href} page={null} $isInline>
      {props.children}
    </OakLink>
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
    <OakLink href={href} page={null} $isInline>
      {props.children}
    </OakLink>
  );
};

export const PTAnchorLink: PortableTextMarkComponent<{
  _type: "anchor";
  anchor: string;
}> = (props) => {
  if (!props.value?.anchor) {
    return null;
  }

  return (
    <OakLink page={null} href={`#${props.value.anchor}`} $isInline>
      {props.children}
    </OakLink>
  );
};

export const PTAnchorTarget: PortableTextMarkComponent<{
  _type: "anchorTarget";
  anchor: string;
}> = (props) => {
  if (!props.value?.anchor) {
    return null;
  }

  return (
    <Box as="span" $position="relative">
      <AnchorTarget id={props.value.anchor} />

      {props.children}
    </Box>
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
    anchorLink: PTAnchorLink,
    anchorTarget: PTAnchorTarget,
    action: PTActionTrigger,
  },
};

export const BasePortableTextProvider: FC<{
  children?: React.ReactNode;
}> = (props) => {
  return (
    <PortableTextComponentsProvider components={basePortableTextComponents}>
      {props.children}
    </PortableTextComponentsProvider>
  );
};
