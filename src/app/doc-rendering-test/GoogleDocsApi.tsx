import { OakBox, OakHeading } from "@oaknational/oak-components";

import eyfs from "./docsApiResponseJson/eyfs.json";
import peGuide from "./docsApiResponseJson/peGuide.json";
import additionalMaterials from "./docsApiResponseJson/additionalMaterials.json";
import { GoogleDocsDocument, GoogleDocsRenderer } from "./GoogleDocsRenderer";
import type { ResourceFile } from "./TestView";

const resourceDocs: Record<ResourceFile, GoogleDocsDocument> = {
  eyfs,
  "pe-guide": peGuide,
  "additional-materials": additionalMaterials,
};

export function GoogleDocsApi({
  resourceFile,
}: {
  resourceFile: ResourceFile;
}) {
  const document = resourceDocs[resourceFile];
  return (
    <OakBox $width="100%">
      <OakHeading tag="h2" $mb="spacing-16">
        Google Docs API
      </OakHeading>
      <OakBox $ba="border-solid-m" $pa="spacing-24" $minWidth="spacing-0">
        <GoogleDocsRenderer document={document} />
      </OakBox>
    </OakBox>
  );
}
