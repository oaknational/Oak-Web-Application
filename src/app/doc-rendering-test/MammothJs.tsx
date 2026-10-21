"use client";

import {
  OakBox,
  OakFlex,
  OakHeading,
  OakTypography,
} from "@oaknational/oak-components";
import { useEffect, useState } from "react";

import { MammothDocumentPreview } from "./MammothDocumentPreview";
import { type DocumentResult, getCachedDoc } from "./getCachedHtml";

export const MammothJs = ({ fileId }: { fileId: string }) => {
  const [result, setResult] = useState<DocumentResult | null>(null);
  const currentResult = result?.fileId === fileId ? result : null;

  useEffect(() => {
    let active = true;
    getCachedDoc(fileId)
      .then((result) => {
        if (active) setResult(result);
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error("Failed to load cached DOCX", error);
        setResult({ fileId, error: true });
      });
    return () => {
      active = false;
    };
  }, [fileId]);

  return (
    <OakFlex $flexDirection="column" $gap="spacing-20" $width="100%">
      <OakHeading tag="h2">Mammoth JS</OakHeading>
      <OakBox
        $ba={
          currentResult && "html" in currentResult
            ? "border-solid-m"
            : "border-solid-none"
        }
        $pa="spacing-24"
        $minWidth="spacing-0"
        aria-busy={!currentResult}
      >
        {currentResult && "error" in currentResult ? (
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
        ) : null}
      </OakBox>
    </OakFlex>
  );
};
