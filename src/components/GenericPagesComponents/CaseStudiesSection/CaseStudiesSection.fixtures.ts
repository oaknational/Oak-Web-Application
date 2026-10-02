import { portableTextFromString } from "@/__tests__/__helpers__/cms";
import { mockPortableTextBlocks } from "@/fixtures/curriculum/programmeSequenceYearData.fixtures";

export const caseStudyFixture = {
  title: "Test",
  tag: "primary",
  summaryRaw: portableTextFromString("TEST_SUMMARY"),
  content: [
    {
      heading: "TEST_HEADING_1",
      anchorSlug: {
        current: "test-anchor-slug-1",
      },
      label: "TEST_LABEL_1",
      contentRaw: portableTextFromString("TEST_CONTENT_1"),
    },
    {
      heading: "TEST_HEADING_2",
      anchorSlug: {
        current: "test-anchor-slug-2",
      },
      label: "TEST_LABEL_2",
      contentRaw: portableTextFromString("TEST_CONTENT_2"),
    },
  ],
  showGetInTouchPanel: true,
  getInTouchPanel: {
    personName: "TEST_PERSON_NAME",
    personImage: {
      altText: null,
      isPresentational: true,
      asset: {
        _id: "image-d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320-png",
        url: "https://cdn.sanity.io/images/cuvjke51/production/d16d5ceea1923b8cf31845affe93f9626f600c4c-240x320.png",
      },
      hotspot: null,
    },
    jobRole: "TEST_JOB_ROLE",
    institutionName: "TEST_INSTITUTION_NAME",
  },
  video: {
    title: "Test Video",
    video: {
      asset: {
        assetId: "test-asset-id",
        playbackId: "test-playback-id",
        thumbTime: null,
      },
    },
    transcript: [mockPortableTextBlocks[0]],
  },
  slug: {
    current: "test",
  },
  image: {
    altText: "Test image alt text",
    asset: {
      _id: "test-image-asset-id",
      url: "https://example.com/test-image.jpg",
    },
  },
  textRaw: portableTextFromString("TEST_TEXT_RAW"),
  publishedAt: "2026-09-30",
};

export const caseStudiesSectionFixture = [
  {
    ...caseStudyFixture,
    title: "Test-1",
    slug: {
      current: "test-1",
    },
  },
  {
    ...caseStudyFixture,
    title: "Test-2",
    slug: {
      current: "test-2",
    },
  },
  {
    ...caseStudyFixture,
    title: "Test-3",
    slug: {
      current: "test-3",
    },
  },
];
