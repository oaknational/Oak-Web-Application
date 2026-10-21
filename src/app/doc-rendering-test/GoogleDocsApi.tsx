import { OakBox, OakHeading } from "@oaknational/oak-components";

import eyfs from "./docsApi/eyfs.json";
import peGuide from "./docsApi/peGuide.json";
import additionalMaterials from "./docsApi/additionalMaterials.json";
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
      <GoogleDocsRenderer document={document} />
    </OakBox>
  );
}
