"use client";

import {
  OakBox,
  OakFlex,
  OakHeading,
  OakLoadingSpinner,
  OakTypography,
} from "@oaknational/oak-components";
import Mammoth from "mammoth/mammoth.browser";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

import { prepareMammothImages, restoreMammothCallouts } from "./mammothImages";
import { MammothDocumentPreview } from "./MammothDocumentPreview";

// Keep Mammoth's default list, footnote and link mappings after these rules.
export const mammothStyleMap = [
  // A paragraph can carry both a heading style and explicit list numbering.
  ...[1, 2, 3, 4, 5].flatMap((level) => {
    const parent = "ul|ol > li > ".repeat(level - 1);
    return [
      `p:unordered-list(${level}) => ${parent}ul > li:fresh`,
      `p:ordered-list(${level}) => ${parent}ol > li:fresh`,
    ];
  }),
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

export const getParsedDocx = async (fileId: string, signal?: AbortSignal) => {
  const response = await fetch(
    `https://docs.google.com/document/d/${fileId}/export?format=docx`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Google Docs export failed: ${response.statusText}`);
  }

  const { arrayBuffer, convertImage, sectionBorders } =
    await prepareMammothImages(await response.arrayBuffer());
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
  return {
    ...result,
    value: restoreMammothCallouts(result.value, sectionBorders),
  };
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
            <MammothDocumentPreview
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
