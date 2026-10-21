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
  eyfs: "SX1Q634srMVFlIWFI3eay2u88YQ9mEfW8D8iBPQ",
  "additional-materials": "1O8iiffZd4NJIq2jnAnebkHB-ONBsPGpLLTSBX90x84E",
  "pe-guide": "1fDlNhHLHmmXobjp2MOGurojAuMjypllFjGnFE0AAtKs",
};

export const TestView = () => {
  const [activeDocument, setActiveDocument] = useState<ResourceFile>("eyfs");
  return (
    <OakFlex
      $flexDirection={"column"}
      $gap={"spacing-20"}
      $maxWidth={"spacing-960"}
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
      <GoogleDocsApi resourceFile={activeDocument} />
      <MammothJs fileId={fileIds[activeDocument]} />
    </OakFlex>
  );
};
