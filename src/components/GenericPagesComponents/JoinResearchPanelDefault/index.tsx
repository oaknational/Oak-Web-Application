import { OakBox } from "@oaknational/oak-components";

import {
  JoinResearchPanelPageBlock,
  JoinResearchPanelPageBlockType,
} from "@/common-lib/cms-types";

export default function JoinResearchPanelPageDefault(
  block: JoinResearchPanelPageBlock<JoinResearchPanelPageBlockType>,
) {
  return (
    <OakBox>
      <code>{JSON.stringify(block, null, 2)}</code>
    </OakBox>
  );
}
