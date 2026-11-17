import { JoinResearchPanelInfoProps } from "./index";

import { portableTextFromString } from "@/__tests__/__helpers__/cms";

export const joinResearchPanelInfoBlockFixture = (
  title?: string,
  body?: string,
): JoinResearchPanelInfoProps => ({
  title: title ?? "Join the research panel",
  image: {
    asset: {
      _id: "image-7499298e050630504fc8eb15bb8de2c864942575-633x486-png",
      url: "https://cdn.sanity.io/images/cuvjke51/production/7499298e050630504fc8eb15bb8de2c864942575-633x486.png",
    },
  },
  bodyRaw: portableTextFromString(body ?? "Join the research panel"),
});
