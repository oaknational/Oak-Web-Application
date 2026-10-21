"use client";

import {
  OakBox,
  OakFlex,
  OakHeading,
  OakLoadingSpinner,
  OakTypography,
  parseColor,
  parseFontSize,
  parseFontWeight,
  parseLetterSpacing,
  parseLineHeight,
  parseSpacing,
} from "@oaknational/oak-components";
import Mammoth from "mammoth/mammoth.browser";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import styled, { css } from "styled-components";

import { prepareMammothImages, restoreMammothCallouts } from "./mammothImages";

// Keep Mammoth's default list, footnote and link mappings after these rules.
export const mammothStyleMap = [
  "p.Title => h1.docx-title:fresh",
  "p.Subtitle => p.docx-subtitle:fresh",
  ...[1, 2, 3, 4, 5, 6].flatMap((level) => [
    `p.Heading${level} => h${level}:fresh`,
    `p[style-name='Heading ${level}'] => h${level}:fresh`,
    `p[style-name='heading ${level}'] => h${level}:fresh`,
  ]),
  "p[style-name='Title'] => h1.docx-title:fresh",
  "p[style-name='Subtitle'] => p.docx-subtitle:fresh",
  "p[style-name='Caption'] => p.docx-caption:fresh",
  "r[style-name='Strong'] => strong",
  "r[style-name='Emphasis'] => em",
  "b => strong",
  "i => em",
  "u => u",
  "strike => s",
  "table => div.docx-table:fresh > table:fresh",
];

const fontStyles = (font: Parameters<typeof parseFontSize>[0]) => css`
  font-size: ${parseFontSize(font)};
  line-height: ${parseLineHeight(font)};
  font-weight: ${parseFontWeight(font)};
  letter-spacing: ${parseLetterSpacing(font)};
`;

const DocumentContent = styled(OakBox)`
  ${fontStyles("body-2")}
  font-family: inherit;
  color: ${parseColor("text-primary")};
  overflow-wrap: anywhere;

  p {
    margin: 0 0 ${parseSpacing("spacing-12")};
    white-space: pre-wrap;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: ${parseSpacing("spacing-24")} 0 ${parseSpacing("spacing-8")};
    break-after: avoid;
  }

  h1 {
    ${fontStyles("heading-5")}
  }

  h2 {
    ${fontStyles("heading-6")}
  }

  h3 {
    ${fontStyles("heading-7")}
  }

  h4 {
    ${fontStyles("body-2-bold")}
  }

  h5,
  h6 {
    ${fontStyles("body-3-bold")}
  }

  h6 {
    font-style: italic;
  }

  .docx-title {
    ${fontStyles("heading-4")}
  }

  .docx-subtitle {
    ${fontStyles("heading-light-6")}
  }

  .docx-caption {
    ${fontStyles("body-3")}
    font-style: italic;
  }

  ul,
  ol {
    margin: 0 0 ${parseSpacing("spacing-12")};
    padding-inline-start: ${parseSpacing("spacing-24")};
  }

  ul {
    list-style-type: disc;
  }

  ul ul {
    list-style-type: circle;
  }

  ul ul ul {
    list-style-type: square;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    margin-bottom: ${parseSpacing("spacing-4")};
  }

  li > ul,
  li > ol {
    margin-top: ${parseSpacing("spacing-4")};
    margin-bottom: 0;
  }

  .docx-table {
    max-width: 100%;
    overflow-x: auto;
    margin-bottom: ${parseSpacing("spacing-24")};
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: inherit;
    line-height: inherit;
  }

  td,
  th {
    padding: ${parseSpacing("spacing-8")};
    vertical-align: top;
    text-align: start;
    font-weight: normal;
  }

  td > :first-child,
  th > :first-child,
  > :first-child {
    margin-top: 0;
  }

  td > :last-child,
  th > :last-child {
    margin-bottom: 0;
  }

  img {
    display: inline-block;
    max-width: 100%;
    height: auto;
    vertical-align: middle;
  }

  .docx-callout {
    padding: ${parseSpacing("spacing-12")};
    margin-bottom: ${parseSpacing("spacing-12")};
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .docx-callout > :first-child,
  .docx-callout > a[id] + :is(h1, h2, h3, h4, h5, h6) {
    margin-top: 0;
  }

  .docx-callout > :last-child {
    margin-bottom: 0;
  }

  a {
    color: ${parseColor("text-link-active")};
    text-decoration: underline;
    text-underline-offset: ${parseSpacing("spacing-2")};
  }

  a:visited {
    color: ${parseColor("text-link-visited")};
  }

  a:hover,
  a:focus-visible {
    color: ${parseColor("text-link-hover")};
  }

  a:active {
    color: ${parseColor("text-link-pressed")};
  }

  strong {
    font-weight: ${parseFontWeight("body-2-bold")};
  }

  em {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }

  s {
    text-decoration: line-through;
  }

  sup,
  sub {
    font-size: ${parseFontSize("body-4")};
    line-height: 0;
  }

  sup {
    vertical-align: super;
  }

  sub {
    vertical-align: sub;
  }
`;

export const getParsedDocx = async (fileId: string, signal?: AbortSignal) => {
  const response = await fetch(
    `https://docs.google.com/document/d/${fileId}/export?format=docx`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Google Docs export failed: ${response.statusText}`);
  }

  const { arrayBuffer, convertImage } = await prepareMammothImages(
    await response.arrayBuffer(),
  );
  const result = await Mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: mammothStyleMap,
      includeDefaultStyleMap: true,
      includeEmbeddedStyleMap: false,
      ignoreEmptyParagraphs: true,
      idPrefix: "mammoth-",
      convertImage,
    },
  );
  return { ...result, value: restoreMammothCallouts(result.value) };
};

type DocumentResult =
  | {
      fileId: string;
      html: string;
      messages: string[];
    }
  | {
      fileId: string;
      error: true;
    };

export const MammothJs = ({ fileId }: { fileId: string | null }) => {
  const [result, setResult] = useState<DocumentResult | null>(null);
  const currentResult = result?.fileId === fileId ? result : null;

  useEffect(() => {
    if (!fileId) return;
    const controller = new AbortController();
    let active = true;
    getParsedDocx(fileId, controller.signal)
      .then((res) => {
        if (!active) return;
        setResult({
          fileId,
          html: DOMPurify.sanitize(res.value),
          messages: res.messages.map((message) => message.message),
        });
      })
      .catch((error) => {
        if (!active) return;
        console.error("Failed to parse DOCX", error);
        setResult({ fileId, error: true });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [fileId]);

  return (
    <OakFlex $flexDirection="column" $gap="spacing-20" $width="100%">
      <OakHeading tag="h2">Mammoth JS</OakHeading>
      <OakBox $ba="border-solid-m" $pa="spacing-24" $minWidth="spacing-0">
        {!fileId ? (
          <OakTypography role="status">
            The EYFS document is not publicly available, so its DOCX export
            cannot be previewed with Mammoth.
          </OakTypography>
        ) : currentResult && "error" in currentResult ? (
          <OakTypography role="alert">
            Unable to load the DOCX preview. Check that the document is publicly
            accessible.
          </OakTypography>
        ) : currentResult && "html" in currentResult ? (
          <>
            <DocumentContent
              as="article"
              aria-label="Mammoth document preview"
              dangerouslySetInnerHTML={{ __html: currentResult.html }}
            />
            {currentResult.messages.length > 0 && (
              <OakBox role="status" $mt="spacing-16">
                <OakTypography>Document conversion warnings:</OakTypography>
                <ul>
                  {currentResult.messages.map((message, index) => (
                    <li key={index}>{message}</li>
                  ))}
                </ul>
              </OakBox>
            )}
          </>
        ) : (
          <OakBox role="status" aria-label="Loading DOCX preview">
            <OakLoadingSpinner />
          </OakBox>
        )}
      </OakBox>
    </OakFlex>
  );
};
