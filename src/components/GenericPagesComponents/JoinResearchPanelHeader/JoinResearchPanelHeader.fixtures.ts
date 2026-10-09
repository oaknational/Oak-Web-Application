import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { JoinResearchPanelPageBlock } from "@/common-lib/cms-types";

const joinResearchPanelHeaderFixture: JoinResearchPanelPageBlock<"JoinResearchPanelPageHeader"> =
  {
    __typename: "JoinResearchPanelPageHeader",
    title: "Join the Oak research panel",
    bodyRaw: portableTextFromString(
      "Your feedback is essential to help us understand the realities of teaching and learning. By listening to teachers like you, we learn about your preferences, challenges and needs, and can use these insights to shape Oak curriculum resources, lessons and tools.",
    ),
    image: {
      asset: {
        _id: "image-1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422-png",
        url: "https://cdn.sanity.io/images/cuvjke51/production/1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422.png",
      },
    },
    button: {
      label: "Join the research panel",
      linkType: "external",
      external: "https://example.com",
    },
  };

export default joinResearchPanelHeaderFixture;
