import { JoinResearchPanelCalloutProps } from "./JoinResearchPanelCallout";

import { portableTextFromString } from "@/__tests__/__helpers__/cms";

export const basic: JoinResearchPanelCalloutProps = {
  title: "Join the research panel callout",
  items: [
    {
      icon: {
        asset: {
          _id: "image-0123c8cd16c86e1095af18a8f65d427d1c8dd2f9-80x80-svg",
          url: "https://cdn.sanity.io/images/cuvjke51/production/0123c8cd16c86e1095af18a8f65d427d1c8dd2f9-80x80.svg",
        },
      },
      bodyRaw: [
        {
          ...portableTextFromString("Join the research panel callout")[0],
          _key: "key0001",
        },
      ],
    },
    {
      icon: {
        asset: {
          _id: "image-b5ee98bf752dff246de88f50ad59e07131902189-80x80-svg",
          url: "https://cdn.sanity.io/images/cuvjke51/production/b5ee98bf752dff246de88f50ad59e07131902189-80x80.svg",
        },
      },
      bodyRaw: [
        {
          ...portableTextFromString("Join the research panel callout")[0],
          _key: "key0002",
        },
      ],
    },
    {
      icon: {
        asset: {
          _id: "image-8d46237f90341dc2f1ef9f99db370a97e3d014d9-72x54-svg",
          url: "https://cdn.sanity.io/images/cuvjke51/production/8d46237f90341dc2f1ef9f99db370a97e3d014d9-72x54.svg",
        },
      },
      bodyRaw: [
        {
          ...portableTextFromString("Join the research panel callout")[0],
          _key: "key0003",
        },
      ],
    },
  ],
};
