import { OakCodeRenderer } from "@oaknational/oak-components";

import {
  JoinResearchPanelPageBlock,
  JoinResearchPanelPageBlockType,
} from "@/common-lib/cms-types";

export default function JoinResearchPanelPageDefault(
  block: JoinResearchPanelPageBlock<JoinResearchPanelPageBlockType>,
) {
  return (
    <OakCodeRenderer string={"```" + JSON.stringify(block, null, 2) + "```"} />
  );
}
