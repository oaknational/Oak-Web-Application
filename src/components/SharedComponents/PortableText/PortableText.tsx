import React from "react";
import {
  PortableText,
  PortableTextComponents,
  PortableTextMarkComponent,
  PortableTextProps,
} from "@portabletext/react";
import type { TypedObject, PortableTextBlock } from "@portabletext/types";
import styled from "styled-components";
import { merge } from "lodash/fp";
import {
  OakLI,
  OakP,
  OakSpan,
  OakOL,
  OakBox,
} from "@oaknational/oak-components";

import { PTActionTrigger } from "./PTActionTrigger";

import errorReporter from "@/common-lib/error-reporter";
import { resolveInternalHref } from "@/utils/portableText/resolveInternalHref";
import { CTAInternalLinkEntry } from "@/common-lib/cms-types";
import OwaLink from "@/components/SharedComponents/OwaLink";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";

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
    <OwaLink href={href} page={null} $isInline>
      {props.children}
    </OwaLink>
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
    <OwaLink href={href} page={null} $isInline>
      {props.children}
    </OwaLink>
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
    <OwaLink page={null} href={`#${props.value.anchor}`} $isInline>
      {props.children}
    </OwaLink>
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
    <OakBox as="span" $position="relative">
      <AnchorTarget id={props.value.anchor} />
      {props.children}
    </OakBox>
  );
};

const BodyP = styled(OakP)`
  &:first-child {
    margin-top: 0;
  }
`;

export const basePortableTextComponents: PortableTextComponents = {
  block: {
    normal: (props) => {
      return (
        <BodyP
          $font={["body-2", "body-1"]}
          $mt={["space-between-s", "space-between-m"]}
        >
          {props.children}
        </BodyP>
      );
    },
  },
  list: {
    bullet: (props) => <ul>{props.children}</ul>,
    number: (props) => (
      <OakOL $ml={["space-between-s", "space-between-m"]}>
        {props.children}
      </OakOL>
    ),
  },
  listItem: {
    bullet: (props) => (
      <OakLI $font={["list-item-2", "list-item-1"]}>{props.children}</OakLI>
    ),
    number: (props) => (
      <OakLI $font={["list-item-2", "list-item-1"]}>{props.children}</OakLI>
    ),
  },
  marks: {
    strong: (props) => {
      return <OakSpan as="strong">{props.children}</OakSpan>;
    },
    em: (props) => {
      return <OakSpan as="em">{props.children}</OakSpan>;
    },
    internalLink: PTInternalLink,
    link: PTExternalLink,
    anchorLink: PTAnchorLink,
    anchorTarget: PTAnchorTarget,
    action: PTActionTrigger,
  },
};

/**
 * After the update for @portabletext/react from 1 to 3, it no lnoger uses
 * react context to inject components, instead we wrap the PortableText
 * component with a component that has the components prop set to the
 * default components plus any overrides passed in via props.
 * However, previously there were cases where PortableText was used outside
 * context, so the prop withoutDefaultComponents is added here for us to replicate
 * the that behaviour.
 */
export function PortableTextWithDefaults<
  B extends TypedObject = PortableTextBlock,
>(
  props: PortableTextProps<B> & {
    withoutDefaultComponents?: boolean;
  },
): React.JSX.Element {
  const { withoutDefaultComponents, components, ...portableTextProps } = props;
  return (
    <PortableText
      {...portableTextProps}
      components={merge(
        withoutDefaultComponents ? {} : basePortableTextComponents,
        components,
      )}
    />
  );
}
