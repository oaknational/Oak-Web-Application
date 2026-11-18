import { portableTextFromString } from "@/__tests__/__helpers__/cms";

export const basic = {
  title: "Welcome to Oak's national curriculum alignment checker",
  icon: {
    asset: {
      _id: "image-3c48070cafbcfbf8164a0bf315a43263fa91cc41-3410x2234-png",
      url: "https://cdn.sanity.io/images/cuvjke51/production/3c48070cafbcfbf8164a0bf315a43263fa91cc41-3410x2234.png",
    },
  },
  bodyRaw: portableTextFromString(
    "For the refreshed national curriculum, taught in schools from September 2028.",
  ),
  subjectPicker: {
    title: "",
    tag: "",
    bannerLabel: "",
    buttonText: "",
  },
};
