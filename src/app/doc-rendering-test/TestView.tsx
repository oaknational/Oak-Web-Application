"use client";
import {
  OakFlex,
  OakP,
  OakRadioAsButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import { useState } from "react";

import { MammothJs } from "./MammothJs";
import { GoogleDocsApi } from "./GoogleDocsApi";

export type ResourceFile = "eyfs" | "pe-guide" | "additional-materials";
const fileIds: Record<ResourceFile, string> = {
  eyfs: "1UgwlbRRUAjdLMsbOTdX56GI3bkHtECOEUFoggk22Rks",
  "additional-materials": "1O8iiffZd4NJIq2jnAnebkHB-ONBsPGpLLTSBX90x84E",
  "pe-guide": "1fDlNhHLHmmXobjp2MOGurojAuMjypllFjGnFE0AAtKs",
};

export const TestView = () => {
  const [activeDocument, setActiveDocument] = useState<ResourceFile>("eyfs");
  const [preview, setPreview] = useState("google-docs-api");
  return (
    <OakFlex
      $flexDirection={"column"}
      $gap={"spacing-20"}
      $maxWidth={"spacing-1280"}
      $alignItems={"center"}
      $mh={"auto"}
    >
      <OakRadioGroup
        name={"fileIds"}
        onChange={(e) => setActiveDocument(e.target.value as ResourceFile)}
        value={activeDocument}
        $gap="spacing-12"
        $flexDirection="row"
      >
        <OakP $font="heading-7" $mb="spacing-16" as="legend">
          Selected Document
        </OakP>
        {Object.keys(fileIds).map((fileId) => (
          <OakRadioAsButton key={fileId} value={fileId} displayValue={fileId} />
        ))}
      </OakRadioGroup>
      <OakRadioGroup
        name="preview"
        value={preview}
        onChange={(event) => setPreview(event.target.value)}
        $gap="spacing-12"
        $flexDirection="row"
      >
        <OakP $font="heading-7" $mb="spacing-16" as="legend">
          Preview renderer
        </OakP>
        <OakRadioAsButton
          value="google-docs-api"
          displayValue="Google Docs API"
        />
        <OakRadioAsButton value="mammoth" displayValue="Mammoth JS" />
      </OakRadioGroup>
      {preview === "google-docs-api" ? (
        <GoogleDocsApi resourceFile={activeDocument} />
      ) : (
        <MammothJs key={activeDocument} fileId={fileIds[activeDocument]} />
      )}
    </OakFlex>
  );
};
