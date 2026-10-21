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

export const getParsedDocx = async (fileId: string) => {
  const response = await fetch(
    `https://docs.google.com/document/d/${fileId}/export?format=docx`,
  );

  if (!response.ok) {
    throw new Error(`Google Docs export failed: ${response.statusText}`);
  }

  return Mammoth.convertToHtml({
    arrayBuffer: await response.arrayBuffer(),
  });
};

export const MammothJs = ({ fileId }: { fileId: string }) => {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setError(false);
    getParsedDocx(fileId)
      .then((res) => setHtml(res.value))
      .catch((error) => {
        console.error("Failed to parse DOCX", error);
        setError(true);
      });
  }, [html, fileId]);

  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-20"}>
      <OakHeading tag="h2">Mammoth JS</OakHeading>
      <OakBox $ba={"border-solid-m"}>
        {error ? (
          <OakTypography>Oops something went wrong</OakTypography>
        ) : html ? (
          <OakFlex
            $width={"100%"}
            $flexDirection={"column"}
            dangerouslySetInnerHTML={{ __html: html }}
           />
        ) : (
          <OakLoadingSpinner />
        )}
      </OakBox>
    </OakFlex>
  );
};
