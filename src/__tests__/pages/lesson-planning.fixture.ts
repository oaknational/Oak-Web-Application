import { mockImageAsset, portableTextFromString } from "../__helpers__/cms";

import { PlanALessonPage } from "@/common-lib/cms-types";

export const testPlanALessonPageData: PlanALessonPage = {
  id: "planALessonCorePage",
  hero: {
    heading: "test",
    summaryPortableText: portableTextFromString("test"),
    image: { ...mockImageAsset(), altText: "alt text hero" },
    author: {
      id: "13719a7b-4f00-4816-883a-8aded2a5c703",
      name: "Katie Marl",
      role: "Primary Curriculum Design Lead",
      image: {
        altText: "alt text",
        asset: {
          _id: "image-586258ca4b3b23d1a6fc47979841e5a5eb3dc36c-320x256-png",
          url: "https://cdn.sanity.io/images/cuvjke51/production/586258ca4b3b23d1a6fc47979841e5a5eb3dc36c-320x256.png",
        },
        hotspot: null,
      },
      bioPortableText: null,
      socials: null,
    },
  },
  content: [
    {
      type: "PlanALessonPageContent",
      navigationTitle: "test nav content",
      bodyPortableText: portableTextFromString("this is content"),
      anchorSlug: {
        current: "test-nav-content",
      },
    },
    {
      type: "PlanALessonPageContent",
      navigationTitle: "test content 2",
      bodyPortableText: portableTextFromString("content 2"),
      anchorSlug: {
        current: "test-content-2",
      },
    },
    {
      type: "PlanALessonPageFormBlock",
      navigationTitle: "form",
      bodyPortableText: portableTextFromString("form"),
      form: {
        title: "fff",
      },
    },
  ],
  seo: {
    title: "test",
    description: "test",
    canonicalURL: null,
  },
};
