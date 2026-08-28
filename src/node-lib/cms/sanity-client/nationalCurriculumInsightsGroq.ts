import type { Params } from "./cmsMethods";
import { parseResults } from "./parseResults";

import {
  nationalCurriculumInsightsHubSchema,
  type NationalCurriculumInsightsHub,
  nationalCurriculumInsightsGuidancePageSchema,
  type NationalCurriculumInsightsGuidancePage,
  nationalCurriculumInsightsSubjectSchema,
  type NationalCurriculumInsightsSubject,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import getServerConfig from "@/node-lib/getServerConfig";

const imageProjection = `{
  altText,
  isPresentational,
  asset->{
    _id,
    url
  },
  hotspot
}`;

const modulesProjection = `modules[]{
  "__typename": select(
    _type == "nationalCurriculumInsightsHeroSection" => "NationalCurriculumInsightsHeroSection",
    _type == "nationalCurriculumInsightsOverviewSection" => "NationalCurriculumInsightsOverviewSection",
    _type == "nationalCurriculumInsightsPhaseCardsSection" => "NationalCurriculumInsightsPhaseCardsSection",
    _type == "nationalCurriculumInsightsKeyStageCardsSection" => "NationalCurriculumInsightsKeyStageCardsSection",
    _type == "nationalCurriculumInsightsPromotionalHeadingSection" => "NationalCurriculumInsightsPromotionalHeadingSection",
    _type == "nationalCurriculumInsightsPhaseNavigationSection" => "NationalCurriculumInsightsPhaseNavigationSection",
    _type == "nationalCurriculumInsightsSubjectNavigationSection" => "NationalCurriculumInsightsSubjectNavigationSection",
    _type == "nationalCurriculumInsightsNewsletterSection" => "NationalCurriculumInsightsNewsletterSection",
    _type == "nationalCurriculumInsightsFaqSection" => "NationalCurriculumInsightsFaqSection",
    _type == "nationalCurriculumInsightsRichTextSection" => "NationalCurriculumInsightsRichTextSection",
    _type == "nationalCurriculumInsightsImageTextSection" => "NationalCurriculumInsightsImageTextSection",
    _type == "nationalCurriculumInsightsGuidanceIntroSection" => "NationalCurriculumInsightsGuidanceIntroSection",
    _type == "nationalCurriculumInsightsVideoCardsSection" => "NationalCurriculumInsightsVideoCardsSection",
    _type == "nationalCurriculumInsightsQuoteSection" => "NationalCurriculumInsightsQuoteSection",
    _type == "nationalCurriculumInsightsTableSection" => "NationalCurriculumInsightsTableSection",
    _type == "nationalCurriculumInsightsDownloadSection" => "NationalCurriculumInsightsDownloadSection"
  ),
  heading,
  headingStyle,
  variant,
  overviewLabel,
  primaryLabel,
  secondaryLabel,
  phases,
  primaryHeading,
  secondaryHeading,
  introduction,
  benefitsHeading,
  benefits,
  "privacyPortableText": privacyText,
  formId,
  buttonLabel,
  barHeading,
  barCtaLabel,
  detailsHeading,
  downloadsHeading,
  downloadsIntroduction,
  downloadButtonLabel,
  illustration ${imageProjection},
  "bodyPortableText": body,
  "contentPortableText": content,
  "introductionPortableText": introduction,
  authorName,
  authorRole,
  authorImage ${imageProjection},
  statusHeading,
  statusMessage,
  imagePosition,
  background,
  ctaLabel,
  ctaHref,
  statusLabel,
  quote,
  attribution,
  role,
  videoUrl,
  duration,
  "image": select(
    _type in [
      "nationalCurriculumInsightsHeroSection",
      "nationalCurriculumInsightsImageTextSection",
      "nationalCurriculumInsightsGuidanceIntroSection",
      "nationalCurriculumInsightsQuoteSection"
    ] => image ${imageProjection}
  ),
  items[]{
    question,
    "answerPortableText": answer
  },
  cards[]{
    phase,
    keyStage,
    heading,
    description,
    linkLabel,
    videoUrl,
    duration,
    "image": select(
      ^._type == "nationalCurriculumInsightsVideoCardsSection" => image ${imageProjection}
    )
  },
  "posts": posts[]->{
    "id": _id,
    title,
    summary,
    "slug": slug.current,
    "image": mainImage ${imageProjection},
    "video": content[_type == "reference" && @->_type == "video"][0]->{
      title,
      captions,
      transcript,
      video {
        asset->{
          assetId,
          playbackId,
          thumbTime
        }
      }
    }
  },
  table {
    rows[]{cells}
  }
}`;

const pageSummaryProjection = `{
  "id": _id,
  pageType,
  title
}`;

const keyStagePageProjection = `{
  "id": _id,
  "pageType": "keyStage",
  keyStage,
  title,
  summary,
  ${modulesProjection}
}`;

const pageProjection = `{
  "id": _id,
  pageType,
  title,
  summary,
  "keyStages": coalesce(keyStages[]{
    keyStage,
    label,
    "page": page->${keyStagePageProjection}
  }, []),
  ${modulesProjection}
}`;

export const nationalCurriculumInsightsHubQuery = `
  *[
    _type == "nationalCurriculumInsightsHub" &&
    _id in [$hubId, $draftHubId]
  ] | order(_updatedAt desc)[0] {
    "id": _id,
    title,
    summary,
    "subjects": subjects[]->{
      "id": _id,
      title,
      slug,
      illustration ${imageProjection},
      curriculumSubjectSlugs,
      tabs[]{
        kind,
        label,
        "page": page->${pageSummaryProjection}
      }
    },
    ${modulesProjection}
  }
`;

export const nationalCurriculumInsightsSubjectBySlugQuery = `
  *[
    _type == "nationalCurriculumInsightsSubject" &&
    slug.current == $subjectSlug
  ] | order(_updatedAt desc)[0] {
    "id": _id,
    "pageType": "overview",
    title,
    summary,
    slug,
    illustration ${imageProjection},
    curriculumSubjectSlugs,
    tabs[]{
      kind,
      label,
      "page": page->${pageProjection}
    },
    ${modulesProjection}
  }
`;

export const nationalCurriculumInsightsGuidancePageQuery = `
  *[
    _type == "nationalCurriculumInsightsGuidancePage" &&
    _id in [$guidanceId, $draftGuidanceId]
  ] | order(_updatedAt desc)[0] {
    "id": _id,
    "pageType": "guidance",
    title,
    summary,
    ${modulesProjection}
  }
`;

const getNationalCurriculumInsightsClient = async (previewMode = false) => {
  const { createClient } = await import("@sanity/client");
  const client = createClient({
    projectId: getServerConfig("sanityProjectId"),
    dataset: getServerConfig("sanityDataset"),
    apiVersion: "2026-08-05",
    useCdn: getServerConfig("sanityUseCDN") === "true" && !previewMode,
    token: getServerConfig("sanityGraphqlApiSecret"),
  });

  return {
    client,
    perspective: previewMode ? ("drafts" as const) : ("published" as const),
  };
};

export const getNationalCurriculumInsightsHub = async ({
  previewMode,
}: Params = {}): Promise<NationalCurriculumInsightsHub | null> => {
  const { client, perspective } = await getNationalCurriculumInsightsClient(
    Boolean(previewMode),
  );
  const result = await client.fetch(
    nationalCurriculumInsightsHubQuery,
    {
      hubId: "nationalCurriculumInsightsHub",
      draftHubId: "drafts.nationalCurriculumInsightsHub",
    },
    { perspective },
  );

  if (!result) {
    return null;
  }

  return parseResults(
    nationalCurriculumInsightsHubSchema,
    result,
    perspective === "drafts",
  );
};

export const getNationalCurriculumInsightsSubjectBySlug = async (
  subjectSlug: string,
  { previewMode }: Params = {},
): Promise<NationalCurriculumInsightsSubject | null> => {
  const { client, perspective } = await getNationalCurriculumInsightsClient(
    Boolean(previewMode),
  );
  const result = await client.fetch(
    nationalCurriculumInsightsSubjectBySlugQuery,
    { subjectSlug },
    { perspective },
  );

  if (!result) {
    return null;
  }

  return parseResults(
    nationalCurriculumInsightsSubjectSchema,
    result,
    perspective === "drafts",
  );
};

export const getNationalCurriculumInsightsGuidancePage = async ({
  previewMode,
}: Params = {}): Promise<NationalCurriculumInsightsGuidancePage | null> => {
  const { client, perspective } = await getNationalCurriculumInsightsClient(
    Boolean(previewMode),
  );
  const result = await client.fetch(
    nationalCurriculumInsightsGuidancePageQuery,
    {
      guidanceId: "nationalCurriculumInsightsGuidancePage",
      draftGuidanceId: "drafts.nationalCurriculumInsightsGuidancePage",
    },
    { perspective },
  );

  if (!result) {
    return null;
  }

  return parseResults(
    nationalCurriculumInsightsGuidancePageSchema,
    result,
    perspective === "drafts",
  );
};
